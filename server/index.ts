import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import { MongoClient} from "mongodb"; 
import cors from 'cors';
import { v4 as generateID } from 'uuid';
import bcrypt from 'bcrypt';

type UserType = {
  _id: string,
  email: string,
  username: string,
  password: string,
  password_visible: string,
  role: "user" | "admin"
};
interface EditUserBody {
  username: string;
  email: string;
  password?: string;  // Optional, because users may not change their password
}

const app = express();
const PORT = process.env.SERVER_PORT;
const corsOptions = {
  origin: `http://localhost:${process.env.FRONT_PORT}`
};


const DB_CONNECTION = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.${process.env.CLUSTER_ID}.mongodb.net/`;

app.use(express.json());
app.use(cors(corsOptions));

app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}.`));


// restaurants routes
app.get('/restaurants', async (req, res) => {
  let client;
  try {
    client = await MongoClient.connect(DB_CONNECTION);
    const data = await client.db('restoranu_tinklas').collection('restoranai').find().toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err });
  } finally {
    // Safely close the client connection if it exists
    if (client) {
      client.close();
    }
  }
});

// vienas specifinis restoranas (pagal id param) su visais jo staliukais
app.get('/restaurants/:id', async (req: Request, res: Response) => {
  const client = await MongoClient.connect(DB_CONNECTION);
  try {
    const data = await client.db('restoranu_tinklas').collection('restoranai').aggregate([
      {
        $match: {
          _id: req.params.id
        }
      },
      {
        $lookup: {
          from: "staliukai",
          localField: "_id",
          foreignField: "restaurantId",
          as: "tables"
        }
      }
    ]).toArray();
    res.send(data);
  } catch(err) {
    res.status(500).send({ error: err });
  } finally {
    client?.close(); 
  }
});

// comments routes
// get, gaunam komentarus, su vartotojo info, kurie priklauso restoranui, kurio id perduotas paramsuose
app.get('/comments/:restaurantId', async (req: Request, res: Response) => {
  const client = await MongoClient.connect(DB_CONNECTION);
  try {
    const restaurantId = req.params.restaurantId;
    const data = await client.db('restoranu_tinklas').collection('komentarai').aggregate([
      { 
        $match: { 
          "restaurantId": restaurantId
        }
      },{
        $lookup: {
          from: "vartotojai",
          localField: "userId",
          foreignField: "_id",
          as: "userData"
        }
      }
    ]).toArray();
    res.send(data);
  } catch(err) {
    console.error(err);
    res.status(500).send({ error: err })
  } finally {
    client?.close();
  }
});

// post, pridedame naują komentarą ir grąžiname jį su papildytu _id: uuid()
app.post('/comments', async (req: Request, res: Response) => {
  const client = await MongoClient.connect(DB_CONNECTION);
  try {
    // console.log('req body', req.body);
    const commentWithId = {
      ...req.body,
      _id: generateID()
    };
    const mongoResponse = await client.db('restoranu_tinklas').collection('komentarai').insertOne(commentWithId);
    // console.log(mongoResponse);
    res.send(commentWithId);
  } catch(err) {
    console.error(err);
    res.status(500).send({ error: err });
  } finally {
    client?.close();
  }
});

// users routes
// get all, užkraunant
app.get('/users', async (req: Request, res: Response) => {
  const client = await MongoClient.connect(DB_CONNECTION);
  try {
    const data = await client.db('restoranu_tinklas').collection('vartotojai').find().toArray();
    res.send(data);
  } catch(err) {
    res.status(500).send({ error: err })
  }finally {
    // jei client vis dar gyvas
    client?.close(); // nutraukia BackEnd'o ryšį su DB
  }
});


// post, sukuriant naują  ( middleware )
const checkUniqueUser = async (req: Request<{},{}, Omit<UserType, "_id">>, res: Response<{errorMessage: string} | { error: unknown }>, next: NextFunction) => {
  // console.log(req.body);
  const client = await MongoClient.connect(DB_CONNECTION);
  try {
    const sameEmail = await client.db('restoranu_tinklas').collection<UserType>('vartotojai').findOne({ email: req.body.email });
    const sameUsername = await client.db('restoranu_tinklas').collection<UserType>('vartotojai').findOne({ username: req.body.username });
    // console.log(sameEmail, sameUsername);
    if(sameEmail){
      res.status(409).send({ errorMessage: 'Vartotojas su tokiu email jau egzistuoja.' });
    } else if(sameUsername){
      res.status(409).send({ errorMessage: 'Vartotojas su tokiu slapyvardžiu jau egzistuoja.' });
    } else {
      next();
    }
  } catch(err) {
    console.error(err);
    res.status(500).send({ error: err });
  } finally {
    // jei client vis dar gyvas
    client?.close(); // nutraukia BackEnd'o ryšį su DB
  }
};
// kurti naują vartotoją jeigu unikalus
app.post('/users', checkUniqueUser, async (req: Request, res: Response) => {
  const client = await MongoClient.connect(DB_CONNECTION);
  try {
    // console.log('req body', req.body);
    const userToInsert = {
      ...req.body,
      password: bcrypt.hashSync(req.body.password, 10),
      _id: generateID()
    };
    const data = await client.db('restoranu_tinklas').collection('vartotojai').insertOne(userToInsert);
    // console.log('data po inserto', data);
    res.send(userToInsert);
  } catch(err) {
    res.status(500).send({ error: err });
  } finally {
    // jei client vis dar gyvas
    client?.close(); // nutraukia BackEnd'o ryšį su DB
  }
});

// get, kuris grąžina vieną specific pagal email+password
app.post('/users/login', async (req: Request, res: Response) => {
  const client = await MongoClient.connect(DB_CONNECTION);
  try {
    // console.log(req.body);
    const data = await client.db('restoranu_tinklas').collection<UserType>('vartotojai').findOne({ email: req.body.email });
    // console.log(data);
    if(data === null){ // netinkamas email
      res.status(401).send({ error: 'Vartotojas su tokiu email arba/ir password neegzsituoja.' });
    } else { // buvo surastas pagal email
      const passCheck = bcrypt.compareSync(req.body.password, data.password);
      // console.log(passCheck);
      if(passCheck === false){ // tinkamas email, bet netinkamas password
        res.status(401).send({ error: 'Vartotojas su tokiu email arba/ir password neegzsituoja.' });
      } else { // tinkamas email ir password
        res.status(200).json(data ); 
      }
    }
  } catch(err) {
    console.error(err);
    res.status(500).send({ error: err });
  } finally {
    // jei client vis dar gyvas
    client?.close(); // nutraukia BackEnd'o ryšį su DB
  }
});


// delete one specific user by _id
app.delete('/users/:id', async (req, res) => {
  const client = await MongoClient.connect(DB_CONNECTION);
  try {
    const id = req.params.id;
    const deletionResponse = await client.db('restoranu_tinklas').collection<UserType>('vartotojai').deleteOne({ _id: id });
    // const editResponse = await client.db('restoranu_tinklas').collection<UserType>('vartotojai').updateOne({ _id: id }, { name: 'kebab'}); // čia šita eilutė ne delete route'e, bet put/patch bus reikalinga
    res.send(deletionResponse);
  } catch(err) {
    console.error(err);
    res.status(500).send({ error: err });
  } finally {
    // jei client vis dar gyvas
    client?.close(); // nutraukia BackEnd'o ryšį su DB
  }
});

// Middleware for logging or validation
// const validateUser = (req: Request, res: Response, next: NextFunction): void => {
//   if (!req.body.username || !req.body.email) {
//     res.status(400).json({ error: 'Username and email are required' });
//   } else {
//     next(); // Proceed to the next middleware/route handler if validation passes
//   }
// };



// Middleware to authenticate or log actions before processing
// const logRequest = (req: Request, res: Response, next: NextFunction) => {
//   console.log(`Request made to update user with ID: ${req.params.id}`);
//   next();
// };


// app.patch('/edit-user/:id', async (req, res) => {
//   const client = await MongoClient.connect(DB_CONNECTION);
//   try {
//     const { username, email, password } = req.body;
//     const id = req.params.id;
    
//     let updateFields: Partial<UserType> = { username, email };

//     // Hash the password only if a new one is provided
//     if (password) {
//       const hashedPassword = bcrypt.hashSync(password, 10);  // Hash the password
//       updateFields.password = hashedPassword;  // Include the hashed password in update
//     }

//     // Update the user document in MongoDB
//     const editResponse = await client
//       .db('restoranu_tinklas')
//       .collection<UserType>('vartotojai')
//       .updateOne({ _id: id }, { $set: updateFields });

//     res.send(editResponse);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ error: err });
//   } finally {
//     client?.close();  // Close the DB connection
//   }
// });



// app.patch('/edit-user/:id', async (req, res) => {
//   const client = await MongoClient.connect(DB_CONNECTION);
//   try {
//     const { username, email, password, password_visible } = req.body; // Include password_visible in the request body
//     const id = req.params.id;

//     const editResponse = await client
//       .db('restoranu_tinklas')
//       .collection<UserType>('vartotojai')
//       .updateOne({ _id: id }, { $set: { username, email, password, password_visible } });

//     res.send(editResponse);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ error: err });
//   } finally {
//     client?.close();  // Close the DB connection
//   }
// });

app.patch('/edit-user/:id', async (req, res) => {
  const client = await MongoClient.connect(DB_CONNECTION);
  try {
    const { username, email, password } = req.body;
    const id = req.params.id;
    
    let updateFields: Partial<UserType> = { username, email };

    // Hash the password only if a new one is provided
    if (password) {
      const hashedPassword = bcrypt.hashSync(password, 10);  // Hash the password
      updateFields.password = hashedPassword;  // Include the hashed password in update
      updateFields.password_visible = password;  // Include the plain text password in update
    }

    // Update the user document in MongoDB
    const editResponse = await client
      .db('restoranu_tinklas')
      .collection<UserType>('vartotojai')
      .updateOne({ _id: id }, { $set: updateFields });

    res.send(editResponse);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  } finally {
    client?.close();  // Close the DB connection
  }
});
