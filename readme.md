## Assignment Checklist
### E
1. ~~Build a recommendation system that can find similar users and find recommendations for a user, using the movies large dataset~~
> You can verify that your application works by using the example dataset from the lecture
2. ~~Use Euclidean distance as similarity measure~~
3. Implement the system using a REST web service where:
  3.1. ~~client sends a request to a server~~
  3.2. ~~the server responds with json data~~
  3.3. ~~the json data is decoded and presented in a client GUI~~
### C-D
1. ~~Implement the Pearson Correlation similarity measure~~
2. ~~It shall be possible to select which measure to use from the client GUI~~
### A-B
1. ~~Implement functionality for pre-generating an Item-Based Collaborative Filtering table by transforming the original data set~~
2. ~~Use the pre-generated table to implement a second way of finding recommendations for a user~~
3. ~~You shall only use Euclidean distance as similarity measure~~
4. ~~It shall be possible to select how to find recommendations from the client GUI (Item-Based or User-Based)~~
### GUI Appearance & Execution Examples
> Note: While I am no designer by any means, this GUI could have been made prettier with more time. You said that appearance does not matter, and this fulfils all functional requirements so I deem it as "good enough", but no more than that.
#### Large Dataset: Angela (Euclidean distance)
![Large Dataset: Angela (Euclidean distance)](https://i.gyazo.com/762f6e87fccd386472b4d3fe7999606a.png)
#### Large Dataset: Will (Pearson similarity)
![Large Dataset: Will (Pearson similarity)](https://i.gyazo.com/999e9e33c826ce772159008fb07cf5aa.png)
#### Large Dataset: Andy (Item-based collaborative filtering)
![Large Dataset: Andy (Item-based collaborative filtering)](https://i.gyazo.com/b15cd98a209c6cea7d5df760b8bad454.png)