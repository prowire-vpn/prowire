import "package:flutter/material.dart";

class ClientConfig extends ChangeNotifier {
  String? apiUrl;

  String get getApiUrl {
    if (apiUrl == null) throw Exception("Api URL is not defined");
    return apiUrl as String;
  }

  void setConfig(String newApiUrl) {
    apiUrl = newApiUrl;
    notifyListeners();
  }
}
