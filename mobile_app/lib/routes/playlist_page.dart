import 'package:flutter/material.dart';


class PlaylistPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Playlist'),
      ),
      body: ListView(
        children: ListTile.divideTiles(
          context: context,
          tiles: [
            ListTile(
              title: const Text('Top Hits 2023'),
              leading: const Icon(Icons.music_note),
              onTap: () {/*Action to be taken when Playlist is selected*/},
            ),
            ListTile(
              title: const Text('Rock Classics'),
              leading: const Icon(Icons.music_note),
              onTap: () {/* Action to be taken when Playlist is selected*/},
            ),
            ListTile(
              title: const Text('Jazz Essentials'),
              leading: const Icon(Icons.music_note),
              onTap: () {/*Action to be taken when Playlist is selected*/},
            ),
          ],
        ).toList(),
      ),
    );
  }
}
