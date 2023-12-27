import 'package:flutter/material.dart';
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
    // Retrieve userData and notifications inside the build method
    final userData = Provider.of<UserProvider>(context).userData;
    final notifications = Provider.of<UserProvider>(context).notifications;

    return Scaffold(
      appBar: AppBar(
        title: Text('Profile'),
        leading: IconButton(
          icon: Icon(Icons.home),
          onPressed: () {
            Navigator.pushReplacementNamed(context, '/home');
          },
        ),
        actions: [
          // Display notifications in the app bar
          IconButton(
            icon: Icon(Icons.notifications),
            onPressed: () {
              // Handle notification button press
              // You can show a notification dialog or navigate to a notifications page
            },
          ),
        ],
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Color.fromARGB(255, 255, 254, 254), // White at the top
              Color.fromARGB(255, 222, 174, 188), // Pinkish color at the bottom
            ],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            stops: [0.0, 0.7],
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // Wrap the Image.asset with ClipOval
              ClipOval(
                child: Image.asset(
                  'assets/images/profile_picture.jpg',
                  width: 100,
                  height: 100,
                  fit: BoxFit.cover,
                ),
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
              SizedBox(height: 16),
              // Display notifications
              buildNotificationsList(notifications),
            ],
          ),
        ),
      ),
    );
  }

  Widget buildNotificationsList(List<Map<String, dynamic>> notifications) {
    return Expanded(
      child: ListView.builder(
        itemCount: notifications.length,
        itemBuilder: (context, index) {
          final notification = notifications[index];
          return ListTile(
            title: Text(notification['title']),
            subtitle: Text(notification['body']),
            // Add more UI elements as needed
          );
        },
      ),
    );
  }
}
