import "package:flutter/material.dart";

class AuthConfig extends ChangeNotifier {
  String? error;
  String? state;
  String? accessToken;
  String? refreshToken;

  String get getAccessToken {
    if (accessToken == null) throw Exception("Access token is not defined");
    return accessToken as String;
  }

  String get getRefreshToken {
    if (refreshToken == null) throw Exception("Access token is not defined");
    return refreshToken as String;
  }

  void setError(String newError) {
    error = newError;
    notifyListeners();
  }

  void setState(String newState) {
    state = newState;
    notifyListeners();
  }

  void setAccessToken(String newAccessToken) {
    accessToken = newAccessToken;
    notifyListeners();
  }

  void setTokens(String newAccessToken, String newRefreshToken) {
    accessToken = newAccessToken;
    refreshToken = newRefreshToken;
    notifyListeners();
  }
}
