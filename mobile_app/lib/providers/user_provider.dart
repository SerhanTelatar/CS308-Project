import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';


class UserProvider extends ChangeNotifier {
  Map<String, dynamic>? _userData;
  List<Map<String, dynamic>> _notifications = [];


  Map<String, dynamic>? get userData => _userData;
  List<Map<String, dynamic>> get notifications => _notifications;

  void setUserData(Map<String, dynamic>? userData) {
    _userData = userData;
    notifyListeners();
  }



  Future<void> fetchNotifications(String userId) async {
    try {
      final response = await http.get(Uri.parse('http://10.0.2.2:4200/notification/$userId'));
      print('Response Status Code: ${response.statusCode}');

      if (response.statusCode == 200) {
        final List<dynamic> jsonData = json.decode(response.body);
        _notifications = List<Map<String, dynamic>>.from(jsonData);
        notifyListeners();
      }  else  {
        throw Exception('Failed to load notifications');
      }
    } catch (error) {
      print('Error fetching notifications: $error');
    }
  }

  Future<void> closeNotification(String notificationId) async {
    try {
      await http.put(Uri.parse('http://10.0.2.2:4200/notification/close/$notificationId'));
      // Optionally, update the local notifications list to remove the closed notification
      _notifications.removeWhere((notification) => notification['id'] == notificationId);
      notifyListeners();
    } catch (error) {
      print('Error closing notification: $error');
      // Handle error
    }
  }
}

