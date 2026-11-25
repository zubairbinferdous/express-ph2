
import express , {type Application, type Request, type Response} from "express";
const app : Application = express();
import { config } from "./config";
import { pool } from "./db";


app.use(express.json());
app.use(express.text());

app.get("/" , (req:Request , res:Response ) => {
  // res.send('hello this is me ');
  res.status(200).json({
    success:true,
    message:"this is new sms",
    author:"PH"
  });

})

app.post("/api/v1/users" , async(req : Request , res : Response) => {
  const {name ,email,password, age} = req.body;

  try {
  const result = await pool.query(
    `INSERT INTO users (name,email,password,age) VALUES ($1,$2,$3,$4) RETURNING *`, [ name , email , password , age],);

  res.status(201).json({
    success:true,
    message:"User create !!",
    data:result.rows[0]
  });
    
  } catch (error:any) {
    res.status(500).json({
    success:false,
    message: error?.message, 
    error:error
  });
  }

});


app.get("/api/v1/users" , async(req:Request , res:Response) => {
  try {

    const result = await pool.query(`SELECT * FROM users`);
    // console.log(result);

    res.status(200).json({
    success:true,
    message:"Get all user data !!",
    data:result.rows
    });
    
  } catch (error:any) {
     res.status(500).json({
    success:false,
    message: error?.message, 
    error:error
  });
  }
})


app.get("/api/v1/users/:id" , async(req:Request , res:Response) => {
  try {
    const {id} = req.params;
    const result = await pool.query(`SELECT * FROM users WHERE id=$1 `, [id]);

    // console.log(result);

    res.status(200).json({
    success:true,
    message:"Get user data !!",
    data:result.rows[0]
    });
    
  } catch (error:any) {
     res.status(500).json({
    success:false,
    message: error?.message, 
    error:error
  });
  }
})


app.delete("/api/v1/users/:id" , async(req:Request , res:Response) => {
  try {
    const {id} = req.params;
    const result = await pool.query(`DELETE FROM users WHERE id=$1 RETURNING *`, [id]);

    // console.log(result);
    
    if(result.rowCount === 0){
       res.status(404).json({
        success:false,
        message:"User not found!",
      });
    }

    res.status(200).json({
    success:true,
    message:"User deleted successfully!",
    // data:result.rows[0]
    });
    
  } catch (error:any) {
     res.status(500).json({
    success:false,
    message: error?.message, 
    error:error
  });
  }
})



app.put("/api/v1/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, password, age, is_Active } = req.body;

    const result = await pool.query(
      `
    UPDATE users 
    SET
    name = COALESCE($1, name),  
    password = COALESCE($2, password),
    age = COALESCE($3, age),
    is_Active = COALESCE($4, is_Active),
    update_at = NOW() 
    WHERE id=$5 RETURNING *
      `,
      [name ?? null, password ?? null, age ?? null, is_Active ?? null, id],
    );
    // console.log(result);

    res.status(200).json({
      success: true,
      message: "User updated successfully!",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
});




export default app;
// # Postgres — your database connection
// DATABASE_URL="postgresql://neondb_owner:npg_c10xXDwQtqYS@ep-falling-grass-bigi7rys.c-5.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
// DATABASE_URL_POOLED="postgresql://neondb_owner:npg_c10xXDwQtqYS@ep-falling-grass-bigi7rys-pooler.c-5.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"