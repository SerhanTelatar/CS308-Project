class Music {
  final String id;
  final MusicData data;

  Music({required this.id, required this.data});

  factory Music.fromJson(Map<String, dynamic> json) {
    return Music(
      id: json['id'] as String,
      data: MusicData.fromJson(json['data'] as Map<String, dynamic>),
    );
  }
}

class MusicData {
  final String? albumName;
  final int? personalRating;
  final dynamic artist; // String veya List<String> olabilir
  final bool? isAlbum;
  final String addedByUserId;
  final String musicName;
  final String musicType;

  MusicData({
    this.albumName,
    this.personalRating,
    required this.artist,
    required this.isAlbum,
    required this.addedByUserId,
    required this.musicName,
    required this.musicType,
  });

  factory MusicData.fromJson(Map<String, dynamic> json) {
    return MusicData(
      albumName: json['albumName'] as String?,
      personalRating: json.containsKey('personalRating') ? json['personalRating'] as int? : null,
      artist: json['artist'], 
      isAlbum: json['isAlbum'] as bool? ?? false,
      addedByUserId: json['addedByUserId'] as String,
      musicName: json['musicName'] as String,
      musicType: json['musicType'] as String,
    );
  }
}
