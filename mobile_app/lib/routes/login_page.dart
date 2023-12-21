import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:provider/provider.dart';
import 'package:mobile_app/providers/user_provider.dart';
import 'package:mobile_app/components/spotify_login_button.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({Key? key}) : super(key: key);

  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  
 Future<void> _login(String username, String password) async {
    final baseUrl = "http://10.0.2.2:4200";
    final loginEndpoint = "/login";

    try {
      final response = await http.post(
        Uri.parse('$baseUrl$loginEndpoint'),
        body: {
          'username': username,
          'password': password,
        },
      );

      if (response.statusCode == 200) {
        // Successful login
        print('Login successful');

        // Retrieve userData from the response
        final Map<String, dynamic> userData = json.decode(response.body);

        // Navigate to the profile page and pass the userData
         Provider.of<UserProvider>(context, listen: false).setUserData(userData);
         Navigator.pushReplacementNamed(context, '/profile');





      } else {
        // Handle login failure
        print('Login failed with status code ${response.statusCode}: ${response.body}');
        // ... handle other cases as needed
      }
    } catch (e) {
      // Handle other exceptions (e.g., network issues)
      print('Exception during login: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Login failed: $e'),
          duration: Duration(seconds: 3),
        ),
      );
    }
  }










  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Login'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            TextFormField(
              controller: _usernameController,
              decoration: InputDecoration(labelText: 'Username'),
            ),
            SizedBox(height: 16.0),
            TextFormField(
              controller: _passwordController,
              obscureText: true,
              decoration: InputDecoration(labelText: 'Password'),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton(
                  onPressed: () {
                    // "Forgot Password" functionality here
                  },
                  child: Text('Forgot password?'),
                ),
              ],
            ),
            ElevatedButton(
              onPressed: () async {
                String username = _usernameController.text;
                String password = _passwordController.text;

                try {
                  await _login(username, password);
                } catch (e) {
                  // You don't need this SnackBar here anymore.
                }
              },
              child: const Text('Login'),
            ),
            const SizedBox(height: 16.0),
            SpotifyLoginButton(
              onPressed: () {
                //_spotifyLogin();
              },
            ),
            const SizedBox(height: 16.0),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                const Text("Not registered yet?"),
                TextButton(
                  onPressed: () {
                    Navigator.pushNamed(context, '/register');
                  },
                  child: const Text('SignUp'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}