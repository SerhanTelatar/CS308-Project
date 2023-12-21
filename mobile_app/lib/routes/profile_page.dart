import 'package:flutter/material.dart';
import 'package:mobile_app/components/app_drawer.dart';
import 'package:mobile_app/components/navigation_bar.dart';
import 'search_page.dart';
import 'playlist_page.dart';
import 'home_page.dart';
import 'package:provider/provider.dart';
import 'package:mobile_app/providers/user_provider.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({Key? key}) : super(key: key);

  @override
  _ProfilePageState createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  @override
  Widget build(BuildContext context) {
    // Retrieve userData inside the build method
    final userData = Provider.of<UserProvider>(context).userData;

    return Scaffold(
      appBar: AppBar(
        title: Text('Profile'),
        actions: [
          IconButton(
            icon: Icon(Icons.home),
            onPressed: () {
              // Navigate to the home page
              Navigator.pushReplacementNamed(context, '/home');
            },
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            CircleAvatar(
              radius: 50,
              backgroundColor: Colors.blue, // Placeholder color
              child: Icon(Icons.person, size: 50, color: Colors.white),
            ),
            SizedBox(height: 16),
            Text(
              userData?['username']['username']?.toString() ?? 'Unknown',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                ElevatedButton(
                  onPressed: () {
                    // Handle edit button press
                  },
                  child: Text('Edit Profile'),
                ),
              ],
            ),
            SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                Column(
                  children: [
                    Text(
                      'Followers',
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                    Text(
                      (userData != null && userData['followers'] != null)
                          ? userData['followers'].length.toString()
                          : '0',
                    ),
                  ],
                ),
                Column(
                  children: [
                    Text(
                      'Following',
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                    Text(
                      (userData != null && userData['following'] != null)
                          ? userData['following'].length.toString()
                          : '0',
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
