import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class RegisterPage extends StatefulWidget {
  const RegisterPage({Key? key}) : super(key: key);

  @override
  _RegisterPageState createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _surnameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController =
      TextEditingController();

  Future<void> _register(
    String name,
    String username,
    String email,
    String password,
  ) async {
    final baseUrl = "http://10.0.2.2:4200"; // Update with your server's port
    final registerEndpoint = "/register"; // Assuming your register route is "/register"

    try {
      final response = await http.post(
  Uri.parse('$baseUrl$registerEndpoint'),
  body: {
    'name': name,
    'username': username, // Change from 'surname' to 'username'
    'email': email,
    'password': password,
  },
);

      if (response.statusCode == 201) {
        // Successful registration
        print('Registration successful. Awaiting approval.');
        Navigator.pushReplacementNamed(context, '/login');
        // You can navigate to a success page or handle it as needed
      } else {
        // Handle registration failure
        print(
            'Registration failed with status code ${response.statusCode}: ${response.body}');
      }
    } catch (e) {
      // Handle other exceptions
      print('Exception during registration: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Register'),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              TextFormField(
                controller: _nameController,
                decoration: InputDecoration(labelText: 'Name'),
              ),
              SizedBox(height: 16.0),
              TextFormField(
                controller: _surnameController,
                decoration: InputDecoration(labelText: 'Username'),
              ),
              SizedBox(height: 16.0),
              TextFormField(
                controller: _emailController,
                decoration: InputDecoration(labelText: 'Email'),
              ),
              SizedBox(height: 16.0),
              TextFormField(
                controller: _passwordController,
                obscureText: true,
                decoration: InputDecoration(labelText: 'Password'),
              ),
              SizedBox(height: 16.0),
              TextFormField(
                controller: _confirmPasswordController,
                obscureText: true,
                decoration: InputDecoration(labelText: 'Confirm Password'),
              ),
              SizedBox(height: 16.0),
              ElevatedButton(
                onPressed: () async {
                  String name = _nameController.text;
                  String username = _surnameController.text;
                  String email = _emailController.text;
                  String password = _passwordController.text;

                  try {
                    await _register(name, username, email, password);
                  } catch (e) {
                    // Display error message in a SnackBar
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Registration failed: $e'),
                        duration: Duration(seconds: 3),
                      ),
                    );
                  }
                },
                child: Text('Register'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
