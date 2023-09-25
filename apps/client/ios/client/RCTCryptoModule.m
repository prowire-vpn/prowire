// RCTCryptoModule.m
#import "RCTCryptoModule.h"
#import <React/RCTLog.h>
#import <React/RCTConvert.h>
#import <Foundation/Foundation.h>
#import <Security/Security.h>

@implementation RCTCryptoModule

RCT_EXPORT_MODULE(RCTCryptoModule);

RCT_EXPORT_METHOD(createKeyPair:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSMutableDictionary *privateKeyAttr = [[NSMutableDictionary alloc] init]; 
    NSMutableDictionary *publicKeyAttr = [[NSMutableDictionary alloc] init]; 
    NSMutableDictionary *keyPairAttr = [[NSMutableDictionary alloc] init]; 

    SecKeyRef publicKey = NULL; 
    SecKeyRef privateKey = NULL; 
    
    [keyPairAttr setObject:(__bridge id)kSecAttrKeyTypeRSA
    forKey:(__bridge id)kSecAttrKeyType];
    [keyPairAttr setObject:[NSNumber numberWithInt:2048]
    forKey:(__bridge id)kSecAttrKeySizeInBits];
    
    [privateKeyAttr setObject:[NSNumber numberWithBool:YES] forKey:(__bridge id)kSecAttrIsPermanent]; 
    // [privateKeyAttr setObject:privateTag forKey:(__bridge id)kSecAttrApplicationTag]; 
    
    [publicKeyAttr setObject:[NSNumber numberWithBool:YES] forKey:(__bridge id)kSecAttrIsPermanent]; 
    // [publicKeyAttr setObject:publicTag forKey:(__bridge id)kSecAttrApplicationTag]; 
    
    [keyPairAttr setObject:privateKeyAttr forKey:(__bridge id)kSecPrivateKeyAttrs]; 
    [keyPairAttr setObject:publicKeyAttr forKey:(__bridge id)kSecPublicKeyAttrs]; 
    
    OSStatus err = SecKeyGeneratePair((__bridge CFDictionaryRef)keyPairAttr, &publicKey, &privateKey);
    
    if (err == errSecSuccess) {
        NSString *privateKeyPEM = PEMStringFromRSAKey(privateKey, YES);
        NSString *publicKeyPEM = PEMStringFromRSAKey(publicKey, NO);
        
        NSDictionary *keyPairDict = @{
            @"publicKey": publicKeyPEM,
            @"privateKey": privateKeyPEM
        };
        
      resolve(keyPairDict);
    } else {
        NSError *error = [NSError errorWithDomain:NSOSStatusErrorDomain code:err userInfo:nil];
      reject(@"Failed to generate RSA key pair", error.description, nil);
    }
}

NSString *PEMStringFromRSAKey(SecKeyRef key, BOOL isPrivateKey) {
    NSData *keyData = CFBridgingRelease(SecKeyCopyExternalRepresentation(key, NULL));
        
    if (!keyData) {
        NSLog(@"Error getting key data");
        return nil;
    }
    
    NSString *keyType = isPrivateKey ? @"PRIVATE" : @"PUBLIC";
    NSString *header = [NSString stringWithFormat:@"-----BEGIN %@ KEY-----", keyType];
    NSString *footer = [NSString stringWithFormat:@"-----END %@ KEY-----", keyType];
    
    NSString *base64KeyData = [keyData base64EncodedStringWithOptions:0];
    
    NSMutableString *pemString = [NSMutableString string];
    [pemString appendString:header];
    [pemString appendString:@"\n"];
    
    NSUInteger index = 0;
    while (index < base64KeyData.length) {
        NSUInteger length = MIN(64, base64KeyData.length - index);
        NSString *line = [base64KeyData substringWithRange:NSMakeRange(index, length)];
        [pemString appendString:line];
        [pemString appendString:@"\n"];
        index += length;
    }
    
    [pemString appendString:footer];
    [pemString appendString:@"\n"];
    
    return pemString;
}

@end
