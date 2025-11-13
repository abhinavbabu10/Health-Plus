// import { Router } from "express";
// import {
//   createAppointment,
//   getAppointments,
//   getAppointmentById,
//   updateAppointment,
//   deleteAppointment,
// } from "../controllers/appointmentController"; 

// import { authMiddleware } from "../middlewares/authMiddleware";
// import { roleMiddleware } from "../middlewares/roleMiddleware";

// const router = Router();


// router.post("/", authMiddleware, roleMiddleware(["patient"]), createAppointment);


// router.get("/", authMiddleware, getAppointments);
// router.get("/:id", authMiddleware, getAppointmentById);


// router.put("/:id", authMiddleware, roleMiddleware(["doctor", "admin"]), updateAppointment);

// router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteAppointment);

// export { router as appointmentRoutes };
