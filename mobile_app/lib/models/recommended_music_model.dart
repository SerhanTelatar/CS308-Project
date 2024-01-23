class RecommendedSongsList {
  List<RecommendedSong> recommendedSongs;

  RecommendedSongsList({required this.recommendedSongs});

  factory RecommendedSongsList.fromJson(Map<String, dynamic> json) {
    var list = json['recommendedSongs'] as List;
    List<RecommendedSong> recommendedSongsList = list.map((i) => RecommendedSong.fromJson(i)).toList();
    return RecommendedSongsList(recommendedSongs: recommendedSongsList);
  }
}

class RecommendedSong {
  String id;
  SongData data;

  RecommendedSong({required this.id, required this.data});

  factory RecommendedSong.fromJson(Map<String, dynamic> json) {
    return RecommendedSong(
      id: json['id'],
      data: SongData.fromJson(json['data']),
    );
  }
}

class SongData {
  String artist;
  String addedByUserId;
  String musicName;
  String musicType;

  SongData({
    required this.artist,
    required this.addedByUserId,
    required this.musicName,
    required this.musicType,
  });

  factory SongData.fromJson(Map<String, dynamic> json) {
    return SongData(
      artist: json['artist'],
      addedByUserId: json['addedByUserId'],
      musicName: json['musicName'],
      musicType: json['musicType'],
    );
  }
}
