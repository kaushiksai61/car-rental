package com.edutech.car_rental_management_system.repository;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface Transactional {
    // This defines a custom annotation, but it won't actually 
    // do anything unless you write an Aspect for it.
}