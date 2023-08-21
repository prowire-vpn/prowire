import "dart:convert";
import "dart:io";
import "package:http/http.dart" as http;

class ApiService {
  String? base_url;

  Future<dynamic> get(String url) async {
    dynamic responseJson;
    if (base_url == null) {
      throw Exception("No base url");
    }
    try {
      final response = await http.get(Uri.parse(base_url! + url));
      return returnResponse(response);
    } on SocketException {
      throw Exception("No Internet Connection");
    }
  }

  dynamic returnResponse(http.Response response) {
    if (response.statusCode >= 300) {
      throw Exception("Error: ${response.statusCode} ${response.body}");
    }
    return jsonDecode(response.body);
  }
}
