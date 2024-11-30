package com.example.profile;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class ProfileApplication {
	public static void main(String[] args) {
		SpringApplication.run(ProfileApplication.class, args);
	}
}
