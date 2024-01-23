import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import 'package:mobile_app/models/recommended_music_model.dart';

const baseUrl = 'http://10.0.2.2:4200';



Future<RecommendedSongsList> fetchRecommendedSongs() async {
  const userId= "9fKpPcrHOGPHARWQJwzo";
  final response = await http.get(Uri.parse(baseUrl + '/recommendation/$userId'));

  if (response.statusCode == 200) {
    return RecommendedSongsList.fromJson(json.decode(response.body));
  } else {
    throw Exception('Failed to load recommended songs');
  }
}

class RecommendationsSection extends StatefulWidget {
  const RecommendationsSection({Key? key}) : super(key: key);

  @override
  _RecommendationsSectionState createState() => _RecommendationsSectionState();
}

class _RecommendationsSectionState extends State<RecommendationsSection> {
  late RecommendedSongsList futureMusicData;

@override
  void initState() {
    super.initState();
    _fetchAndSetMusicData();
  }

  Future<void> _fetchAndSetMusicData() async {
    try {
      futureMusicData = await fetchRecommendedSongs();
    } catch (e) {
      _showCustomDialog(context, 'Error', 'Failed to fetch music data: $e');
    }
  }
  
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const _RecommendationsHeader(),
        Expanded(
          child: FutureBuilder<RecommendedSongsList>(
          future: fetchRecommendedSongs(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return CircularProgressIndicator();
            } else if (snapshot.hasError) {
              return Text('Error: ${snapshot.error}');
            } else {
              // Display the songs
              return ListView.builder(
                itemCount: snapshot.data?.recommendedSongs.length ?? 0,
                itemBuilder: (context, index) {
                  var song = snapshot.data!.recommendedSongs[index];
                  return ListTile(
                    title: Text(song.data.musicName),
                    subtitle: Text(song.data.artist),
                  );
                },
              );
            }
          },
        ),
        ),
      ],
    );
  }

}

class _RecommendationsHeader extends StatelessWidget {
  const _RecommendationsHeader({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      width: MediaQuery.of(context).size.width,
      decoration: const BoxDecoration(
        color: Colors.deepPurple,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(12.0),
          topRight: Radius.circular(12.0),
        ),
      ),
      child: const Text(
        'Recommendations',
        style: TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.bold,
          fontSize: 18,
        ),
      ),
    );
  }
}

class RecommendationItem extends StatelessWidget {
  final String musicName;
  final String artist;
  final String albumName;
  final String musicType;

  const RecommendationItem({Key? key, required this.musicName, required this.albumName, required this.artist, required this.musicType}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(8.0),
        color: Colors.grey.shade200,
      ),
      child: ListTile(
        leading: const Icon(Icons.music_note),
        title: Text(musicName),
        subtitle: Text(artist),
        trailing: Text(musicType),
      ),
    );
  }
}
void _showCustomDialog(BuildContext context, String title, String content) {
  showDialog(
    context: context,
    builder: (BuildContext context) {
      return AlertDialog(
        title: Text(title),
        content: Text(content),
        actions: <Widget>[
          TextButton(
            child: const Text('Okey'),
            onPressed: () {
              Navigator.of(context).pop(); // Dialog'u kapat
            },
          ),
        ],
      );
    },
  );
}