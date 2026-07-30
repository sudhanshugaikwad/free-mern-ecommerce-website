import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";


function Signup() {

    const [showPassword, setShowPassword] = useState(false)
    const [loding,setLoding] = useState(false)
    const [formData, setFormData] = useState({
        firstName:"",
        lastName:"",
        email:"",
        password:"",
    })
    const navigate = useNavigate()

    const handelChange =(e)=>{
        const {name, value} = e.target;

        setFormData((prev)=>({
            ...prev,
            [name]:value
        }))
    }

    const submitHandler = async(e)=>{
        e.preventDefault()
        console.log(formData)
        try {
            setLoding(true)
            const res = await axios.post(`http://localhost:8000/api/v1/user/register`,formData,{
                headers:{
                    "contant-Type":"application/json"
                }
            })

            if (res.data.success) {
                navigate("/verify")
                toast.success(res.data.message)
            }
            
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        } finally{
            setLoding(false)
        }
    }


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter Given details to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>

            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="First Name">First Name</Label>
                    <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Sudhanshu"
                    required
                    value={FormData.firstName}
                    onChange={handelChange}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="Last Name">First Name</Label>
                    <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Gaikwad"
                    required
                    value={FormData.lastName}
                    onChange={handelChange}
                    />
                </div>
                
                </div>
              </div>
              <div className="grid gap-2">
                    <div>
                    <Label htmlFor="email" className="mt-1 mb-2">Email</Label>
                    <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="sudhanshu@example.com"
                    required
                    value={FormData.email}
                    onChange={handelChange}
                    />
                    </div>
                </div>
              <div className="grid gap-2">
                <div className="flex items-center mt-1">
                  <Label htmlFor="password">Password</Label>
                </div>
                <div className="relative">
                    <Input id="password"
                    name="password"
                    placeholder="Crate a password"
                    type={showPassword ? "text":"password"}
                    required
                    value={FormData.password}
                    onChange={handelChange}/>
                    {
                        showPassword ? <Eye onClick={()=>setShowPassword(false)} className="w-5 h-5 text-gray-700 absolute right-5 bottom-2"/> : 
                        <EyeOff onClick={()=>setShowPassword(true)} className="w-5 h-5 text-gray-700 absolute right-5 bottom-2"/>
                    }
              
                </div>
                
            </div>
          
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button onClick={submitHandler} type="submit" className="w-full cursor-pointer bg-gray-950">
            {loding ? <><Loader2 className="h4 w-4 animate-spin mr-2 "/> Please wait..!</> : 'Signup'}
          </Button>
          <p className="text-gray-700 text-sm">Allredy have an account? <Link to={'/login'} className="hover:underline cursor-pointer text-gray-950">Login</Link></p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Signup;
