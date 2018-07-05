<h1 style="color:green">mongo-buddy</h1>
A CLI for MongoDB utilities such as viewing connection details and generating mock data.
<img src="https://i.imgur.com/AkQlR5L.png=200px" height=300>

1. Clone Repo
```bash
git clone https://github.com/ChristianArredondo/mongo-buddy.git
```

2. cd into directory and install
```bash
cd mongo-buddy
npm install -g ./
```

3. Ensure your local mongo server is running

4. Test MongoDB connection using `mongobuddy`

```bash
# run `mongobuddy check` with proper inputs
mongobudy check --db my-test-db
```
Sample result:

<img src="https://i.imgur.com/b5RDNts.png" alt="sample command output">

5. Query MongoDB for single document of a specified db and collection using `mongobuddy`
```bash
mongobuddy single-doc --db my-test-db --coll test-users
```

Sample result:

<img src="https://i.imgur.com/DQCqFiD.png" alt="sample command output">