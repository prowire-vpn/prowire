import "package:equatable/equatable.dart";

class ClientConfigResponse extends Equatable {
  final String googleClientId;

  const ClientConfigResponse({
    required this.googleClientId,
  });

  @override
  List<Object?> get props => [googleClientId];

  factory ClientConfigResponse.fromJson(Map<String, dynamic> json) {
    return ClientConfigResponse(
        googleClientId: json["googleClientId"] as String);
  }
}
