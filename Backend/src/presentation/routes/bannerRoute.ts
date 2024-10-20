// src/presentation/routes/cartRoute.ts
import express from "express";
import { BannerController } from "../controllers/bannerController"; 
import { BannerInteractor } from "../../application/interactor/bannerInteractor";
import { upload } from "../../config/multerConfig";
import CloudinaryService from "../../application/services/cloudinary";


// Set up dependencies
const cloudinaryService = new CloudinaryService()
const bannerInteractor  = new BannerInteractor(cloudinaryService)
const bannerController = new BannerController(bannerInteractor)


const bannerRoutes = express.Router();

// Define routes
bannerRoutes.post("/offerBanner",upload.single('image'),bannerController.addOfferBanner.bind(bannerController))

export default bannerRoutes;
