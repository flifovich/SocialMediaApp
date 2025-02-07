package com.SocialApp.SocialApp.features.authentication.utilities;

import org.springframework.stereotype.Component;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

@Component
public class Encoder {

    public String encode(String rawString){
        try{
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawString.getBytes()); // without this, password can be decoded on base64 site
            return Base64.getEncoder().encodeToString(hash);
        }catch (NoSuchAlgorithmException e){
            throw new RuntimeException("Error while encoding", e);
        }

    }

    public boolean matches(String rawString, String encodedString){
        return encode(rawString).equals(encodedString);
    }
}
