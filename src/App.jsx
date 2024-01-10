import { useEffect, useState } from "react";
import "./App.css";
import { Auth } from "./components/auth";
import { db, auth, storage } from "./config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

function App() {
  const [movieList, setMovieList] = useState([]);
  const moviesCollectionRef = collection(db, "movies");

  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [newIsMovieOscarWinner, setNewIsMovieOscarWinner] = useState(false);

  const [updatedTitle, setUpdatedTitle] = useState("");

  const [fileUpload, setFileUpload] = useState(null);

  const getMovieList = async () => {
    try {
      const data = await getDocs(moviesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setMovieList(filteredData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMovieList();
  }, []);

  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        isOscarWinner: newIsMovieOscarWinner,
        userId: auth?.currentUser?.uid,
      });
      getMovieList();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await deleteDoc(movieDoc);
    getMovieList();
  };

  const updateMovie = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await updateDoc(movieDoc, { title: updatedTitle });
    getMovieList();
  };

  const uploadFile = async () => {
    if (!fileUpload) return;
    const filesFolderRef = ref(storage, `files/${fileUpload.name}`);

    try {
      await uploadBytes(filesFolderRef, fileUpload);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="App">
        <Auth />

        <div>
          <input
            placeholder="Movie Title"
            onChange={(e) => setNewMovieTitle(e.target.value)}
          />

          <input
            placeholder="Release Date"
            onChange={(e) => setNewReleaseDate(Number(e.target.value))}
          />

          <input
            type="checkbox"
            checked={newIsMovieOscarWinner}
            onChange={(e) => setNewIsMovieOscarWinner(e.target.checked)}
          />

          <label>Received an oscar</label>
          <button onClick={onSubmitMovie}>Submit Movie</button>
        </div>

        <div>
          {movieList.map((movie) => (
            <div>
              <h1 style={{ color: movie.isOscarWinner ? "green" : "black" }}>
                {movie.title}
              </h1>
              <h2>{movie.releaseDate}</h2>
              <p>{movie.isOscarWinner}</p>

              <button onClick={() => deleteMovie(movie.id)}>
                Delete Movie
              </button>
              <input
                placeholder="new title"
                onChange={(e) => setUpdatedTitle(e.target.value)}
              />

              <button onClick={() => updateMovie(movie.id)}>
                Update Title
              </button>
            </div>
          ))}
        </div>

        <div>
          <input
            type="file"
            onChange={(e) => setFileUpload(e.target.files[0])}
          />
          <button onClick={uploadFile}> Upload File</button>
        </div>
      </div>
    </>
  );
}

export default App;
