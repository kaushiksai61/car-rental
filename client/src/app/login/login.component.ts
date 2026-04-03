import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  itemForm!: FormGroup;
  formModel: any = {};
  showError: boolean = false;
  errorMessage: any;
  isLoading: boolean = false;
  registrationSuccess: boolean = false;
  speedLines: any[] = [];

  private mouseMoveHandler: any;
  private mouseLeaveHandler: any;
  private panelEl: HTMLElement | null = null;
  private animFrame: any;
  private carX = 0;
  private farCarX = 0;
  private wheelAngle = 0;

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private ngZone: NgZone
  ) {
    this.itemForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.speedLines = this.buildLines(28);
  }

  buildLines(n: number): any[] {
    return Array.from({ length: n }, (_, i) => ({
      top:     (Math.random() * 85 + 5).toFixed(1) + '%',
      width:   (Math.random() * 160 + 40).toFixed(0) + 'px',
      opacity: (Math.random() * 0.35 + 0.08).toFixed(2),
      dur:     (Math.random() * 1.2 + 0.3).toFixed(2) + 's',
      delay:   '-' + (Math.random() * 3).toFixed(2) + 's',
      red:     Math.random() < 0.2
    }));
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['registered'] === 'success') this.registrationSuccess = true;
    });

    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.panelEl = document.getElementById('leftPanel');
        const spotlight  = document.getElementById('spotlight');
        const linesWrap  = document.getElementById('linesWrap');
        const heroCar    = document.getElementById('heroCar');
        const farCar     = document.getElementById('farCar');
        const starsEl    = document.getElementById('stars');

        // Generate stars
        if (starsEl) {
          for (let i = 0; i < 60; i++) {
            const s = document.createElement('div');
            const size = Math.random() * 2 + 0.5;
            s.style.cssText = `
              position:absolute;
              width:${size}px; height:${size}px;
              border-radius:50%;
              background:rgba(255,255,255,${(Math.random()*0.6+0.2).toFixed(2)});
              left:${(Math.random()*100).toFixed(1)}%;
              top:${(Math.random()*45).toFixed(1)}%;
              animation: twinkle ${(Math.random()*3+2).toFixed(1)}s ease-in-out infinite;
              animation-delay:${(Math.random()*4).toFixed(1)}s;
            `;
            starsEl.appendChild(s);
          }
        }

        // Mouse spotlight + parallax
        if (this.panelEl) {
          this.mouseMoveHandler = (e: MouseEvent) => {
            const rect = this.panelEl!.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const xp = x / rect.width;
            const yp = y / rect.height;

            if (spotlight) {
              spotlight.style.left    = x + 'px';
              spotlight.style.top     = y + 'px';
              spotlight.style.opacity = '1';
            }
            if (linesWrap) {
              linesWrap.style.transform = `translateX(${(xp-0.5)*-30}px) translateY(${(yp-0.5)*-15}px)`;
            }
          };
          this.mouseLeaveHandler = () => {
            if (spotlight) spotlight.style.opacity = '0';
          };
          this.panelEl.addEventListener('mousemove', this.mouseMoveHandler);
          this.panelEl.addEventListener('mouseleave', this.mouseLeaveHandler);
        }

        // Car animation loop
        const panel = this.panelEl;
        const animate = () => {
          if (panel && heroCar && farCar) {
            const w = panel.offsetWidth;
            this.carX += 1.6;
            this.farCarX += 0.8;
            this.wheelAngle += 4;

            if (this.carX > w + 540)    this.carX    = -560;
            if (this.farCarX > w + 280) this.farCarX = -300;

            heroCar.style.transform = `translateX(${this.carX}px)`;
            farCar.style.transform  = `translateX(${this.farCarX}px)`;
          }
          this.animFrame = requestAnimationFrame(animate);
        };

        // Start cars off screen left
        this.carX    = -(window.innerWidth * 0.7 + 560);
        this.farCarX = -(window.innerWidth * 0.7 * 0.5 + 300);
        animate();

      }, 200);
    });
  }

  ngOnDestroy(): void {
    if (this.panelEl) {
      if (this.mouseMoveHandler)  this.panelEl.removeEventListener('mousemove',   this.mouseMoveHandler);
      if (this.mouseLeaveHandler) this.panelEl.removeEventListener('mouseleave',  this.mouseLeaveHandler);
    }
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
  }

  onLogin(): void {
    this.showError = false;
    if (this.itemForm.invalid) { this.itemForm.markAllAsTouched(); return; }
    this.isLoading = true;
    this.http.Login(this.itemForm.value).subscribe(
      (res: any) => {
        this.isLoading = false;
        if (res && res.token) {
          this.auth.saveToken(res.token);
          this.auth.SetRole(res.role);
          this.auth.saveUserId(res.userId);
          this.router.navigate(['/dashboard']);
        } else {
          this.showError   = true;
          this.errorMessage = 'Invalid username or password.';
        }
      },
      () => {
        this.isLoading    = false;
        this.showError    = true;
        this.errorMessage = 'Invalid username or password.';
      }
    );
  }

  registration(): void { this.router.navigate(['/registration']); }
}