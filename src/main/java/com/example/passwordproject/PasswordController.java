
package com.example.passwordproject;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class PasswordController {

    private final PasswordService passwordService;

    public PasswordController(PasswordService passwordService) {
        this.passwordService = passwordService;
    }

    @GetMapping("/test")
    public String test() {
        return "Backend radi!";
    }

    @PostMapping("/check-digit")
    public CheckResponse checkDigit(@RequestBody CheckRequest request) {

        boolean tacno = passwordService.proveriCifru(
                request.pozicija(),
                request.cifra()
        );

        boolean kompletna = tacno && request.pozicija() == 3;

        return new CheckResponse(tacno, kompletna);
    }
}
