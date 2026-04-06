package com.edutech.car_rental_management_system.config;

import com.edutech.car_rental_management_system.jwt.JwtRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
@SuppressWarnings("deprecation")
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable()
                .cors().and()
                .authorizeRequests()

                // ✅ PUBLIC ENDPOINTS
                .antMatchers(
                        "/api/user/register",
                        "/api/user/login",

                        // ✅ OTP OPTION-B endpoints (email verification + forgot password)
                        "/api/user/verify-email-otp",
                        "/api/user/forgot-password",
                        "/api/user/reset-password",
                        "/api/user/resend-otp"
                ).permitAll()

                // ADMIN
                .antMatchers("/api/administrator/**")
                .access("hasAuthority('ADMIN') or hasAuthority('ADMINISTRATOR')")

                // AGENT
                .antMatchers("/api/agent/**").hasAuthority("AGENT")

                // CUSTOMER
                .antMatchers("/api/customers/**").hasAuthority("CUSTOMER")

                // CHATBOT
                .antMatchers("/api/chat/**").hasAuthority("CUSTOMER")

                // ALL OTHER REQUESTS MUST BE AUTHENTICATED
                .anyRequest().authenticated()

                .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        // JWT FILTER
        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
}