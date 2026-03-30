// package com.edutech.car_rental_management_system.config;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.http.HttpMethod;
// import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
// import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
// import org.springframework.security.config.http.SessionCreationPolicy;
// import org.springframework.security.core.userdetails.UserDetailsService;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// import com.edutech.car_rental_management_system.jwt.JwtRequestFilter;


// public class SecurityConfig {

//     // configure the security of the application such that
//     // /api/user/register and /api/user/login are permitted to all
//     // /api/administrator/car-categories is permitted to ADMINISTRATOR
//     // /api/administrator/car-categories is permitted to ADMINISTRATOR
//     // /api/administrator/car-categories/{categoryId} is permitted to ADMINISTRATOR
//     // /api/administrat
//     // r/reports/bookings is permitted to ADMINISTRATOR
//     // /api/administrator/reports/payments is permitted to ADMINISTRATOR
//     // /api/agent/car is permitted to AGENT
//     // /api/agent/car/{carId} is permitted to AGENT
//     // /api/agent/bookings is permitted to AGENT
//     // /api/agent/bookings/{bookingId}/status is permitted to AGENT
//     // /api/agent/payment/{bookingId}  is permitted to AGENT
//     // /api/customers/cars/available is permitter to CUSTOMER
//     // /api/customers/booking is permitter to CUSTOMER

//     // note that check the permission with respect to authority
//     // for example hasAuthority("ADMINISTRATOR")

// }

// package com.edutech.car_rental_management_system.config;

// import com.edutech.car_rental_management_system.jwt.JwtRequestFilter;

// import javax.servlet.Filter;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;

// @Configuration
// @EnableWebSecurity
// public class SecurityConfig {

//     private final JwtRequestFilter jwtRequestFilter;

//     public SecurityConfig(JwtRequestFilter jwtRequestFilter) {
//         this.jwtRequestFilter = jwtRequestFilter;
//     }

//     @Bean
//     public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

//         http.csrf().disable()
//             .authorizeHttpRequests()
//             .antMatchers("/api/user/register", "/api/user/login").permitAll()
//             .antMatchers("/api/administrator/**").hasAuthority("ADMINISTRATOR")
//             .antMatchers("/api/agent/**").hasAuthority("AGENT")
//             .antMatchers("/api/customers/**").hasAuthority("CUSTOMER")
//             .anyRequest().authenticated();

//         http.addFilterBefore((Filter) jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
//         return http.build();
//     }
// }

package com.edutech.car_rental_management_system.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.csrf().disable()
            .authorizeHttpRequests()
            .antMatchers("/api/user/register", "/api/user/login").permitAll()
            .antMatchers("/api/administrator/**").hasAuthority("ADMINISTRATOR")
            .antMatchers("/api/agent/**").hasAuthority("AGENT")
            .antMatchers("/api/customers/**").hasAuthority("CUSTOMER")
            .anyRequest().authenticated()
            .and()
            .httpBasic(); // ✅ simplest, test-friendly

        return http.build();
    }
}