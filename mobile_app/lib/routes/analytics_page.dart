import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:mobile_app/providers/user_provider.dart';


class AnalyticsPage extends StatefulWidget {
  @override
  _AnalyticsPageState createState() => _AnalyticsPageState();
}

class _AnalyticsPageState extends State<AnalyticsPage> {
  late Future<Map<String, dynamic>> analyticsData;
  late UserProvider userProvider;

  @override
  void initState() {
    super.initState();
    userProvider = Provider.of<UserProvider>(context, listen: false);
    final userId = userProvider.userData?['id'];




    if (userId != null) {
      analyticsData = fetchAnalyticsData(userId);
    } else {
      analyticsData = Future.value({});
    }
  }

  Future<Map<String, dynamic>> fetchAnalyticsData(String userId) async {
    final response = await http.get(Uri.parse('http://10.0.2.2:4200/analysis/$userId'));

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load analytics data');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('User Analytics'),
      ),
      body: FutureBuilder<Map<String, dynamic>>(
        future: analyticsData,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else {
            Future.microtask(() {
              userProvider.setUserData(snapshot.data);
            });
            return buildAnalyticsPage(snapshot.data!);
          }
        },
      ),
    );
  }

  Widget buildAnalyticsPage(Map<String, dynamic> data) {
    print('Received Data: $data'); // Debug print to check the received data
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text('Average Rating: ${data['averageRating']}'),
          Text('Total Ratings: ${data['totalRatings']}'),
          Text('Total Ratings: ${data['totalRatings']}'),
          Text('Genre Percentage: ${data['genrePercentage']}'),
          Text('Total Followers: ${data['totalFollowers']}'),
          Text('Total Following: ${data['totalFollowing']}'),
          Text('Total Saved Music: ${data['totalSavedMusic']}'),
          Text('Saved Genre Percentage: ${data['savedMusicGenrePercentage']}'),
          Text('Rated Artists: ${data['ratedArtists']}'),
          // Add more widgets based on your data structure
        ],
      ),
    );
  }
}
