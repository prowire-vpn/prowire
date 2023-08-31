package com.client;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import java.security.KeyFactory;
import java.security.KeyPairGenerator;
import java.security.KeyPair;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Map;
import java.util.HashMap;


public class CryptoModule extends ReactContextBaseJavaModule {
   CryptoModule(ReactApplicationContext context) {
       super(context);
   }

  @Override
  public String getName() {
    return "CryptoModule";
  }

  @ReactMethod
  public void createKeyPair(Promise promise) {
    try {
      KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
      generator.initialize(2048);
      KeyPair pair = generator.generateKeyPair();
      PrivateKey privateKey = pair.getPrivate();
      PublicKey publicKey = pair.getPublic();
      WritableMap keyPair = Arguments.createMap();
      keyPair.putString("privateKey", this.privateKeyToPEM(privateKey));
      keyPair.putString("publicKey", this.publicKeyToPEM(publicKey));
      promise.resolve(keyPair);
    } catch(Exception e) {
      promise.reject("Error", e.getMessage());
    }
  }

  private String privateKeyToPEM(PrivateKey privateKey) throws Exception {
    KeyFactory keyFactory = KeyFactory.getInstance("RSA");
    PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(privateKey.getEncoded());
    byte[] encodedPrivateKey = keyFactory.generatePrivate(keySpec).getEncoded();

    String pemKey = Base64.getEncoder().encodeToString(encodedPrivateKey);
    StringBuilder pemPrivateKey = new StringBuilder();
    pemPrivateKey.append("-----BEGIN PRIVATE KEY-----\n");
    pemPrivateKey.append(pemKey);
    pemPrivateKey.append("\n-----END PRIVATE KEY-----\n");

    return pemPrivateKey.toString();
  }

  private String publicKeyToPEM(PublicKey publicKey) throws Exception {
    KeyFactory keyFactory = KeyFactory.getInstance("RSA");
    X509EncodedKeySpec keySpec = new X509EncodedKeySpec(publicKey.getEncoded());
    byte[] encodedPublicKey = keyFactory.generatePublic(keySpec).getEncoded();

    String pemKey = Base64.getEncoder().encodeToString(encodedPublicKey);
    StringBuilder pemPublicKey = new StringBuilder();
    pemPublicKey.append("-----BEGIN PUBLIC KEY-----\n");
    pemPublicKey.append(pemKey);
    pemPublicKey.append("\n-----END PUBLIC KEY-----\n");

    return pemPublicKey.toString();
  }
}