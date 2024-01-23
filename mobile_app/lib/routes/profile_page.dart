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
        IconButton(
          icon: Icon(Icons.notifications),
          onPressed: () {
            _showNotificationsDialog(context, notifications);
          },
        ),
      ],
    ),
    body: Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Color.fromARGB(255, 255, 254, 254),
            Color.fromARGB(255, 222, 174, 188),
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
          ],
        ),
      ),
    ),
  );
}


  void _showNotificationsDialog(BuildContext context, List<Map<String, dynamic>>? notifications) {
  showDialog(
    context: context,
    builder: (BuildContext context) {
      return Dialog(
        child: Container(
          padding: EdgeInsets.all(16.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('Notifications'),
              SizedBox(height: 8),
              Flexible(
                child: SingleChildScrollView(
                  child: Column(
                    children: buildNotificationsList(notifications),
                  ),
                ),
              ),
              SizedBox(height: 8),
              ElevatedButton(
                onPressed: () {
                  Navigator.of(context).pop();
                },
                child: Text('Close'),
              ),
            ],
          ),
        ),
      );
    },
  );
}

List<Widget> buildNotificationsList(List<Map<String, dynamic>>? notifications) {
  return notifications?.map((notification) {
    final notificationData = notification['data'] as Map<String, dynamic>?;
    final title = notificationData?['type'] as String? ?? 'Default Type';
    final body = notificationData?['status'] as String? ?? 'Default Status';

    return ListTile(
      title: Text(title),
      subtitle: Text(body),
    );
  }).toList() ?? [];
}

}


