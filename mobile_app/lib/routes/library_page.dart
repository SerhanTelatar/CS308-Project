// ignore_for_file: use_build_context_synchronously, invalid_use_of_protected_member, library_private_types_in_public_api
import 'package:flutter/material.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:mobile_app/models/music_model.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:syncfusion_flutter_xlsio/xlsio.dart' hide Row, Column;
import 'dart:io';
import 'package:path_provider/path_provider.dart';
import 'package:open_file/open_file.dart';
import 'package:universal_html/html.dart' show AnchorElement;
import 'package:flutter/foundation.dart' show kIsWeb;

const baseUrl = 'http://10.0.2.2:4200';

Future<List<Music>> fetchMusicData() async {
  final response = await http.get(Uri.parse('$baseUrl/music'));
  if (response.statusCode == 200) {
    List<dynamic> jsonList = json.decode(response.body) as List;
    return jsonList
        .map((jsonItem) => Music.fromJson(jsonItem as Map<String, dynamic>))
        .toList();
  } else {
    throw Exception('Data couldn\'t be loaded: ${response.statusCode}');
  }
}

void deleteMusic(BuildContext context, String musicId, String userId) async {
  final url = Uri.parse('$baseUrl/music/delete-music/$musicId/$userId');
  final response = await http.delete(url);
  if (response.statusCode == 200) {
    _showCustomDialog(context, 'Music Deleted', 'Music deleted successfully');
    // Refresh the list after delete
    (context as StatefulElement).state.setState(() {});
  } else {
    throw Exception('Failed to delete music: ${response.statusCode}');
  }
}

Future<void> createExcel(List<Music> musicList) async {
  final Workbook workbook = Workbook();
  final Worksheet sheet = workbook.worksheets[0];

  // Excel başlıklarını ayarla
  sheet.getRangeByName('A1').setText('Music Name');
  sheet.getRangeByName('B1').setText('Artist');
  sheet.getRangeByName('C1').setText('Album Name');
  sheet.getRangeByName('D1').setText('Rating');

  // Müzik bilgilerini Excel'e yaz
  for (int i = 0; i < musicList.length; i++) {
    int row = i + 2; // Başlık satırını atla
    Music music = musicList[i];
    sheet.getRangeByName('A$row').setText(music.data.musicName);
    sheet.getRangeByName('B$row').setText(music.data.artist ?? '');
    sheet.getRangeByName('C$row').setText(music.data.albumName ?? '');
    sheet
        .getRangeByName('D$row')
        .setNumber(music.data.personalRating?.toDouble() ?? 0.0);
  }

  final List<int> bytes = workbook.saveAsStream().toList();
  // Dosyayı kaydet ve aç
  if (kIsWeb) {
    AnchorElement(
        href:
            'data:application/octet-stream;charset=utf-16le;base64,${base64.encode(bytes)}')
      ..setAttribute('download', 'MusicList.xlsx')
      ..click();
  } else {
    final String path = (await getApplicationSupportDirectory()).path;
    final String fileName =
        Platform.isWindows ? '$path\\MusicList.xlsx' : '$path/MusicList.xlsx';
    final File file = File(fileName);
    await file.writeAsBytes(bytes, flush: true);
    OpenFile.open(fileName);
  }
}

class MyLibraryPage extends StatefulWidget {
  const MyLibraryPage({super.key});

  @override
  _MyLibraryPageState createState() => _MyLibraryPageState();
}

class _MyLibraryPageState extends State<MyLibraryPage> {
  List<Music> allMusicData = [];
  List<Music> filteredMusicData = [];
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _fetchAndSetMusicData();
  }

  Future<void> _fetchAndSetMusicData() async {
    try {
      allMusicData = await fetchMusicData();
      setState(() {
        filteredMusicData = allMusicData;
      });
    } catch (e) {
      _showCustomDialog(context, 'Error', 'Failed to fetch music data: $e');
    }
  }

  void _searchMusic() {
    String searchQuery = _searchController.text.toLowerCase();
    setState(() {
      filteredMusicData = allMusicData.where((music) {
        // check musicName and artist are null or not
        String musicName = music.data.musicName.toLowerCase();
        String artist = music.data.artist?.toLowerCase() ?? '';

        return musicName.contains(searchQuery) || artist.contains(searchQuery);
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          title: TextField(
            controller: _searchController,
            decoration: InputDecoration(
              labelText: 'Search Music',
              suffixIcon: IconButton(
                icon: const Icon(Icons.search),
                onPressed: _searchMusic,
              ),
            ),
            onSubmitted: (_) => _searchMusic(),
          ),
          actions: [
            IconButton(icon: const Icon(Icons.shuffle), onPressed: () {}),
            IconButton(
                icon: const Icon(Icons.play_circle_fill), onPressed: () {}),
            IconButton(
              icon: const Icon(Icons.cloud_download),
              onPressed: () {
                createExcel(filteredMusicData);
              },
            ),
          ]),
      body: Column(
        children: [
          ListTile(
            leading: const Icon(Icons.add, size: 40),
            title: const Text('Add Music'),
            onTap: () => _openAddMusicSheet(context),
          ),
          const Divider(),
          Expanded(
            child: ListView.builder(
              itemCount: filteredMusicData.length,
              itemBuilder: (context, index) {
                return _buildMusicListItem(filteredMusicData[index]);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMusicListItem(Music music) {
    return ListTile(
      title: Text(music.data.musicName),
      subtitle: music.data.artist is String
          ? Text(music.data.artist)
          : Text(music.data.artist.toString()),
      trailing: _buildTrailingWidgets(music),
    );
  }

  Widget _buildTrailingWidgets(Music music) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (music.data.isAlbum != null) Text(music.data.albumName ?? ''),
        RatingBarIndicator(
          rating: music.data.personalRating?.toDouble() ?? 0.0,
          itemBuilder: (context, _) =>
              const Icon(Icons.star, color: Colors.amber),
          itemCount: 5,
          itemSize: 10.0,
          direction: Axis.horizontal,
        ),
        IconButton(
          icon: const Icon(Icons.delete),
          onPressed: () {
            deleteMusic(context, music.id, music.data.addedByUserId);
            _fetchAndSetMusicData();
          },
        ),
      ],
    );
  }

  void _openAddMusicSheet(BuildContext context) {
    final TextEditingController userIdController = TextEditingController();
    final TextEditingController musicNameController = TextEditingController();
    final TextEditingController artistController = TextEditingController();
    final TextEditingController albumNameController = TextEditingController();
    final TextEditingController ratingController = TextEditingController();
    final TextEditingController musicTypeController = TextEditingController();
    bool isChecked = false;

    void _addMusic() async {
      String musicName = musicNameController.text;
      String artist = artistController.text;
      String albumName = albumNameController.text;
      String rating = ratingController.text;
      String musicType = musicTypeController.text;
      String userId = userIdController.text;
      dynamic body = {
        "addedByUserId": userId,
        "musicName": musicName,
        "artist": artist,
        "albumName": albumName,
        "personalRating": rating,
        "musicType": musicType,
        "isAlbum": isChecked,
      };
      final encoded = jsonEncode(body);
      var url = Uri.parse('$baseUrl/add-music/$userId');
      var response = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: encoded,
      );

      if (response.statusCode == 200) {
        _showCustomDialog(context, 'Music added', 'Music added successfully');
        Navigator.of(context).pop(); // Close the bottom sheet

        allMusicData = fetchMusicData() as List<Music>;
      } else {
        _showCustomDialog(context, "Error Occured", "Error Occured");
        Navigator.of(context).pop(); // Close the bottom sheet
      }
    }

    showModalBottomSheet(
      isScrollControlled: true,
      context: context,
      builder: (BuildContext context) {
        return Container(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              TextField(
                decoration: const InputDecoration(
                  labelText: 'User ID',
                ),
                controller: userIdController,
              ),
              TextField(
                decoration: const InputDecoration(
                  labelText: 'Music Name',
                ),
                controller: musicNameController,
              ),
              TextField(
                decoration: const InputDecoration(
                  labelText: 'Artist',
                ),
                controller: artistController,
              ),
              TextField(
                decoration: const InputDecoration(
                  labelText: 'Album Name',
                ),
                controller: albumNameController,
              ),
              RatingBar.builder(
                initialRating: 1,
                minRating: 1,
                direction: Axis.horizontal,
                allowHalfRating: true,
                itemCount: 5,
                itemPadding: const EdgeInsets.symmetric(horizontal: 4.0),
                itemBuilder: (context, _) => const Icon(
                  Icons.star,
                  color: Colors.amber,
                ),
                onRatingUpdate: (rating) {
                  ratingController.text = rating.toString();
                },
              ),
              TextField(
                decoration: const InputDecoration(
                  labelText: 'Music Type',
                ),
                controller: musicTypeController,
              ),
              Checkbox(
                value: isChecked,
                onChanged: (bool? newValue) {
                  setState(() {
                    isChecked = newValue!;
                  });
                },
              ),
              ElevatedButton(
                child: const Text('Submit'),
                onPressed: () {
                  _addMusic();
                },
              ),
            ],
          ),
        );
      },
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
