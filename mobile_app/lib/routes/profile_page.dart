import 'package:flutter/material.dart';

class ProfilePage extends StatelessWidget {
  final bool isUserLoggedIn; // to determine if the user is logged in

  ProfilePage({required this.isUserLoggedIn, Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Profile'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            isUserLoggedIn
                ? Text('User Profile Information')
                : Column(
                    children: [
                      Text('Please log in to view your profile.'),
                      ElevatedButton(
                        onPressed: () {
                          Navigator.pushNamed(context, '/login'); // Navigate to the login page
                        },
                        child: Text('Login'),
                      ),
                    ],
                  ),
          ],
        ),
      ),
    );
  }
}
