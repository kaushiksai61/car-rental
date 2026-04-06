import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

// ... (imports)

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  // --- Variables & State ---
  itemForm!: FormGroup;          // The login form object
  showError = false;             // Controls if an error message is visible
  errorMessage: any;             // The text of the error to show
  isLoading = false;             // Shows/hides a loading spinner during login
  registrationSuccess = false;   // Shows a success message if just coming from registration
  speedLines: any[] = [];        // Data for background animation lines

  // --- Animation References ---
  private mouseMoveHandler: any;
  private mouseLeaveHandler: any;
  private panelEl: HTMLElement | null = null;
  private animFrame: any;
  private carX = 0;              // Position of the main car animation
  private farCarX = 0;           // Position of the background car animation
  private wheelAngle = 0;

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private ngZone: NgZone
  ) {
    // 1. Initialize the Form with validation rules
    this.itemForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    
    // 2. Prepare the background animation lines
    this.speedLines = this.buildLines(28);
  }

  /**
   * Generates random settings (position, speed, opacity) 
   * for the background "speed lines" animation.
   */
  buildLines(n: number): any[] {
    return Array.from({ length: n }, () => ({
      top: (Math.random() * 85 + 5).toFixed(1) + '%',
      width: (Math.random() * 160 + 40).toFixed(0) + 'px',
      opacity: (Math.random() * 0.35 + 0.08).toFixed(2),
      dur: (Math.random() * 1.2 + 0.3).toFixed(2) + 's',
      delay: '-' + (Math.random() * 3).toFixed(2) + 's',
      red: Math.random() < 0.2
    }));
  }

  ngOnInit(): void {
    // 1. Check if the user was redirected here after a successful registration
    this.route.queryParams.subscribe(params => {
      if (params['registered'] === 'success') this.registrationSuccess = true;
    });

    // 2. Start Visual Effects (Runs outside Angular to keep the app fast)
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        // Find HTML elements for the effects
        this.panelEl = document.getElementById('leftPanel');
        const spotlight = document.getElementById('spotlight');
        const linesWrap = document.getElementById('linesWrap');
        const heroCar = document.getElementById('heroCar');
        const farCar = document.getElementById('farCar');
        const starsEl = document.getElementById('stars');

        // Create random "Stars" in the background
        if (starsEl) {
          for (let i = 0; i < 60; i++) {
            const s = document.createElement('div');
            const size = Math.random() * 2 + 0.5;
            s.style.cssText = `
              position:absolute; width:${size}px; height:${size}px; border-radius:50%;
              background:rgba(255,255,255,${(Math.random() * 0.6 + 0.2).toFixed(2)});
              left:${(Math.random() * 100).toFixed(1)}%; top:${(Math.random() * 45).toFixed(1)}%;
              animation: twinkle ${(Math.random() * 3 + 2).toFixed(1)}s ease-in-out infinite;
            `;
            starsEl.appendChild(s);
          }
        }

        // Effect: Follow the mouse with a "Spotlight" and move background slightly (Parallax)
        if (this.panelEl) {
          this.mouseMoveHandler = (e: MouseEvent) => {
            const rect = this.panelEl!.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            if (spotlight) {
              spotlight.style.left = x + 'px';
              spotlight.style.top = y + 'px';
              spotlight.style.opacity = '1';
            }
            if (linesWrap) {
              linesWrap.style.transform = `translateX(${(x/rect.width - 0.5) * -30}px)`;
            }
          };

          this.mouseLeaveHandler = () => {
            if (spotlight) spotlight.style.opacity = '0';
          };

          this.panelEl.addEventListener('mousemove', this.mouseMoveHandler);
          this.panelEl.addEventListener('mouseleave', this.mouseLeaveHandler);
        }

        // Effect: Continuous loop to drive the cars across the screen
        const animate = () => {
          if (this.panelEl && heroCar && farCar) {
            const w = this.panelEl.offsetWidth;
            this.carX += 1.6;     // Speed of front car
            this.farCarX += 0.8;  // Speed of back car
            
            // If car goes off the right side, reset it to the left side
            if (this.carX > w + 540) this.carX = -560;
            if (this.farCarX > w + 280) this.farCarX = -300;

            heroCar.style.transform = `translateX(${this.carX}px)`;
            farCar.style.transform = `translateX(${this.farCarX}px)`;
          }
          this.animFrame = requestAnimationFrame(animate);
        };
        animate();

      }, 200);
    });
  }

  /**
   * Cleanup: Stop animations and remove mouse listeners when leaving the page
   */
  ngOnDestroy(): void {
    if (this.panelEl) {
      this.panelEl.removeEventListener('mousemove', this.mouseMoveHandler);
      this.panelEl.removeEventListener('mouseleave', this.mouseLeaveHandler);
    }
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
  }

  /**
   * Logic: Runs when the user clicks the "Login" button
   */
  onLogin(): void {
    this.showError = false;

    // Stop if form is empty or invalid
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    // Send credentials to the Backend
    this.http.Login(this.itemForm.value).subscribe(
      (res: any) => {
        this.isLoading = false;

        // If successful, save user data and go to the dashboard
        if (res && res.token) {
          this.auth.saveToken(res.token);
          this.auth.SetRole(res.role);
          this.auth.saveUserId(res.userId);
          this.router.navigate(['/dashboard']);
          return;
        }
        this.showError = true;
        this.errorMessage = 'Invalid username or password.';
      },
      (err: any) => {
        // Handle login errors
        this.isLoading = false;
        this.showError = true;

        if (err && err.status === 403) {
          this.errorMessage = 'Email not verified. Please verify OTP.';
        } else if (err && err.status === 401) {
          this.errorMessage = 'Invalid username or password.';
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      }
    );
  }

  /**
   * Navigation: Go to the Registration page
   */
  registration(): void {
    this.router.navigate(['/registration']);
  }
}