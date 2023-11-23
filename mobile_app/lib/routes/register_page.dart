import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class RegisterPage extends StatefulWidget {
  const RegisterPage({Key? key}) : super(key: key);

  @override
  _RegisterPageState createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController =
      TextEditingController();

  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  
  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;

  Future<void> _register(
    String name,
    String username,
    String email,
    String password,
  ) async {
    final baseUrl = "http://10.0.2.2:4200";
    final registerEndpoint = "/register";

    try {
  final response = await http.post(
    Uri.parse('$baseUrl$registerEndpoint'),
    body: {
      'name': name,
      'username': username,
      'email': email,
      'password': password,
    },
  );

  if (response.statusCode == 201) {
    // Successful registration
    print('Registration successful. Awaiting approval.');
    Navigator.pushReplacementNamed(context, '/login');
  } else {
    // Handle registration failure
    print(
        'Registration failed with status code ${response.statusCode}: ${response.body}');
    // Extract error message from response body
    final Map<String, dynamic> responseBody = json.decode(response.body);
    final String errorMessage = responseBody['message'] ?? 'Unknown error';

    // Provide user feedback with a more specific error message
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('$errorMessage'),
        duration: Duration(seconds: 3),
      ),
    );
  }
} catch (e) {
  // Handle other exceptions
  print('Exception during registration: $e');
  // Provide user feedback for general errors
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      content: Text('Registration failed. Please try again.'),
      duration: Duration(seconds: 3),
    ),
  );
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
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                TextFormField(
                  controller: _nameController,
                  decoration: InputDecoration(labelText: 'Name'),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter your name';
                    }
                    return null;
                  },
                ),
                SizedBox(height: 16.0),
                TextFormField(
                  controller: _usernameController,
                  decoration: InputDecoration(labelText: 'Username'),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter a username';
                    }
                    return null;
                  },
                ),
                SizedBox(height: 16.0),
                TextFormField(
                  controller: _emailController,
                  decoration: InputDecoration(labelText: 'Email'),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter your email';
                    } else if (!RegExp(r'^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$').hasMatch(value)) {
                      return 'Please enter a valid email address';
                    }
                    return null;
                  },
                ),
                SizedBox(height: 16.0),
                TextFormField(
                  controller: _passwordController,
                  obscureText: _obscurePassword,
                  decoration: InputDecoration(
                    labelText: 'Password',
                    suffixIcon: IconButton(
                      icon: Icon(_obscurePassword ? Icons.visibility : Icons.visibility_off),
                      onPressed: () {
                        setState(() {
                          _obscurePassword = !_obscurePassword;
                        });
                      },
                    ),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter a password';
                    } else if (value.length < 8) {
                      return 'Password must be at least 8 characters';
                    } else if (!RegExp(r'^(?=.*?[A-Z])').hasMatch(value)) {
                      return 'Password must contain at least 1 uppercase letter';
                    } else if (!RegExp(r'^(?=.*?[a-z])').hasMatch(value)) {
                      return 'Password must contain at least 1 lowercase letter';
                    } else if (!RegExp(r'^(?=.*?[0-9])').hasMatch(value)) {
                      return 'Password must contain at least 1 number';
                    }
                    return null;
                  },
                ),
                SizedBox(height: 16.0),
                TextFormField(
                  controller: _confirmPasswordController,
                  obscureText: _obscureConfirmPassword,
                  decoration: InputDecoration(
                    labelText: 'Confirm Password',
                    suffixIcon: IconButton(
                      icon: Icon(_obscureConfirmPassword ? Icons.visibility : Icons.visibility_off),
                      onPressed: () {
                        setState(() {
                          _obscureConfirmPassword = !_obscureConfirmPassword;
                        });
                      },
                    ),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please confirm your password';
                    } else if (value != _passwordController.text) {
                      return 'Passwords do not match';
                    }
                    return null;
                  },
                ),
                SizedBox(height: 16.0),
                ElevatedButton(
                  onPressed: () async {
                    // Validate the form
                    if (_formKey.currentState?.validate() ?? false) {
                      String name = _nameController.text;
                      String username = _usernameController.text;
                      String email = _emailController.text;
                      String password = _passwordController.text;

                      await _register(name, username, email, password);
                    }
                  },
                  child: Text('Register'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
