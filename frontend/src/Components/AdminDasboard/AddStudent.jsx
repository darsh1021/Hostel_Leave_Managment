import React, { useState } from 'react';
import './AddStudent.css';
import { handleError, handleSuccess } from '../../util';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddStudent = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
 s_name:"",department:"",division:"",r_no:"",s_phone:"",p_phone:"",address:"",photo_url:"",p_email:""
  });
  
  const [roomData,setRoomData] = useState({id:"",status:"",students:[],capacity:"",current:""});
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.s_name.trim() === "") return; 
    const updatedRoomData = {
      ...roomData,
      students: [...roomData.students, formData.s_name]
    };
  
    setRoomData(updatedRoomData);
  
    try {
      // Save student form
      const res1 = await axios.post('http://localhost:5000/auth/saveForm', formData);
      if (res1.data.success) {
         axios.post('http://localhost:5000/auth/saveData', updatedRoomData);
        handleSuccess("Student Added Successfully And Room allocated: " + formData.r_no);
      }
    } catch (err) {
      handleError("Error Occurred");
    }
    finally
    {
       setTimeout(() => navigate("/admin-ui"), 1500);
    }
  
    // Clear input field
    setFormData(prev => ({ ...prev, s_name: "" }));
  };  

  return (
    <div className="add-student-container">
      <h2>Add New Student</h2>
      <form onSubmit={handleSubmit} className="add-student-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="studentName">Student Name</label>
            <input
              type="text"
              id="studentName"
              name="studentName"
              value={formData.s_name}
              onChange={(e) => {
  setFormData({
  ...formData,      
  s_name: e.target.value
})}}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="studentClass">Class</label>
            <input
              type="text"
              id="studentClass"
              name="studentClass"
              value={formData.department}
              onChange={(e) => setFormData({
  ...formData,      
  department: e.target.value
})}
              required
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="division">Email</label>
            <input
              type="text"
              id="division"
              name="division"
              value={formData.division}
              onChange={(e) => setFormData({
  ...formData,      
  division: e.target.value
})}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="roomNumber">Room Number</label>
            <input
              type="text"
              id="roomNumber"
              name="roomNumber"
              value={formData.r_no}
              onChange={(e) => {

                setRoomData({...roomData,id:e.target.value})
setFormData({
  ...formData,      
  r_no: e.target.value
})}}
              required
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="studentPhone">Student Phone</label>
            <input
              type="tel"
              id="studentPhone"
              name="studentPhone"
              value={formData.s_phone}
              onChange={(e) => setFormData({
  ...formData,      
  s_phone: e.target.value
})}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="parentPhone">Parent Phone</label>
            <input
              type="tel"
              id="parentPhone"
              name="parentPhone"
              value={formData.p_phone}
              onChange={(e) => setFormData({
  ...formData,      
  p_phone: e.target.value
})}
              required
            />
          </div>
        </div>
         <div className="form-row">
          <div className="form-group">
            <label htmlFor="p_email">Parent Email</label>
            <input
              type="email"
              id="p_email"
              name="p_email"
              value={formData.p_email}
              onChange={(e) => setFormData({
  ...formData,      
  p_email: e.target.value
})}
              required
            />
          </div>
          </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={((e) => setFormData({
  ...formData,      
  address: e.target.value
}))}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="photoUrl">Photo URL (Optional)</label>
          <input
            type="url"
            id="photoUrl"
            name="photoUrl"
            value={formData.photo_url}
            onChange={(e) => setFormData({
  ...formData,      
  photo_url: e.target.value
})}
            placeholder="https://example.com/photo.jpg"
          />
        </div>
        
        <button type="submit" className="submit-btn">Add Student</button>
      </form>
      <ToastContainer/>
    </div>
  );
};

export default AddStudent;