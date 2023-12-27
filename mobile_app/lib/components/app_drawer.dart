import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:mobile_app/providers/user_provider.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: <Widget>[
          DrawerHeader(
            decoration: const BoxDecoration(
              color: Colors.white,
            ),
            child: Center(child: Image.asset('assets/images/logo.png')),
          ),
          ListTile(
            title: const Text('Homepage'),
            onTap: () {
              Navigator.of(context).pushReplacementNamed('/home');
            },
          ),
          ListTile(
            title: const Text('Analytics'),
            onTap: () {
              // Replace 'Analytics' with the actual route for analytics page
              Navigator.pushNamed(context, '/analytics');
            },
          ),
          ListTile(
            title: const Text('My Library'),
            onTap: () {
              Navigator.pushNamed(context, '/mylibrary');
            },
          ),
          const Divider(), // Separator
          ListTile(
            title: const Text('Logout'),
            onTap: () async {
              try {
              // Make an HTTP request to the server's logout endpoint
              final response = await http.get(Uri.parse('http://10.0.2.2:4200/login/logout'));

              if (response.statusCode == 200) {
                // If the logout was successful, clear user data in the provider
                Provider.of<UserProvider>(context, listen: false).setUserData(null);

                // You may also want to navigate the user to the login screen or another appropriate screen
                Navigator.pushReplacementNamed(context, '/login');
              } else {
                // Handle logout failure
                print('Logout failed');
                print('Logout failed. Status Code: ${response.statusCode}, Response Body: ${response.body}');

              }
            } catch (error) {
              // Handle network error or other exceptions
              print('Error during logout: $error');
            }

            },
          ),
          const Divider(), // Separator
          ListTile(
            leading: const CircleAvatar(
              backgroundImage: AssetImage('assets/images/profile_picture.jpg'),
            ),
            title: const Text('Profile'),
            onTap: () {
              Navigator.pushNamed(context, '/profile');
            },
          ),
        ],
      ),
    );
  }
}
