/** As this is to be an expensive operation and that we only use this in tests, we return a pre-computed one */
export async function generateDiffieHellmanParameters() {
  return `-----BEGIN DH PARAMETERS-----
MIIBCAKCAQEAqQFw8smmjT84qSI/szVtF162/AwoqFRF2X1Z687tP50o00aB2K9U
NJyqjEBZPZyfe5oRq75vWeLe1vw73lBWAtOdewKYU0TlSrjNUvGkPozIYmdyFwJC
/oMitc8M7fjphr8cwpTuoLOt1u03vqqmv4Y+31sdIxaW8JbTxFa1tgZfWQdBIdO4
5cMCW7DEHPWMPqJe9v/voiPZTEMBIuRkwrfrT+CSK0NTlwt31LNeEbP2w7ouff86
dbJk6f/1XS6gd1OtucX2Gh3a/CKcMX5VKUVUqSPlD9usxxh0CrhAYQo4ovHiT0fJ
fuHaAhPpq+4NxuFWU35oHVhqqA5s1tmgqwIBAg==
-----END DH PARAMETERS-----
`;
}
