import 'package:flutter/material.dart';

class SearchBox extends StatefulWidget {
  final Function(String) onSearch;

  SearchBox({required this.onSearch});

  @override
  _SearchBoxState createState() => _SearchBoxState();
}

class _SearchBoxState extends State<SearchBox> {
  final TextEditingController _controller = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: TextField(
        controller: _controller,
        decoration: InputDecoration(
          labelText: 'Search',
          suffixIcon: IconButton(
            icon: Icon(Icons.search),
            onPressed: () => widget.onSearch(_controller.text),
          ),
        ),
        onSubmitted: (String value) {
          widget.onSearch(value);
        },
      ),
    );
  }
}
