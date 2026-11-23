
package com.example.passwordproject;

import org.springframework.stereotype.Service;

@Service
public class PasswordService {

    private final String sifra = "3578";

    public boolean proveriCifru(int pozicija, String cifra) {

        if (pozicija < 0 || pozicija >= sifra.length()) {
            return false;
        }

        return sifra.charAt(pozicija) == cifra.charAt(0);
    }
}
