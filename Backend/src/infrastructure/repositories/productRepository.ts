// src/infrastructure/repositories/productRepository.ts
import { ProductCreationDTO, Variant } from "../../domain/dtos/ProductDTO";
import mongoose, { Model } from "mongoose";
import IProductSchema from "../../domain/entities/productSchema";
import { BaseRepository } from "./baseRepository";
import { IproductRepo } from '../../interface/productInterface/IproductRepo'
import {ProductResponse} from '../../types/productTypes'
import { ProductModel } from "../../infrastructure/model/producModel";

type listing = {
  isListed: boolean
}
export class ProductRepository extends BaseRepository<IProductSchema> implements IproductRepo {
  constructor(model: Model<IProductSchema>) {
    super(model);
  }

  async addProduct(productDTO: ProductCreationDTO): Promise<IProductSchema> {
    const productEntity = {
      name: productDTO.name,
      subCategory: productDTO.subCategory,
      category: productDTO.category,
      descriptions: productDTO.descriptions,
      sku:productDTO.sku,
      ean:productDTO.sku,
      images: productDTO.images,
      variants: productDTO.variants,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await super.create(productEntity);

  }
  async addBulkProduct(productData: any): Promise<any> {
   
    const productEntity = {
      sku:productData.sku,
      ean:productData.ean,
      name: productData.name,
      subCategory: productData.subCategory,
      category: productData.mainCategory,
      descriptions: productData.Descriptions,
      images: productData.images.toString().split(','),
      variants:[{
        weight:productData.variantWeight,
        inPrice:productData.variantInPrice,
        outPrice:productData.variantOutPrice,
        stockQuantity:productData.variantStockQuantity
      }],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await super.create(productEntity);

  }
  
  async findAllProducts(page:number,limit:number): Promise<ProductResponse> {
    const totalProducts = await this.model.countDocuments();
     const skip = (page - 1) * limit;
     const products =await this.model.find().skip(skip).limit(limit).populate('category').exec();
    return {products:products,totalPages: Math.ceil(totalProducts / limit)}

  }
  async findAllProductsInJsonWithAggregation(): Promise<ProductResponse> {
    try {
        const products = await this.model.aggregate([
            { $match: {} },
            {
                $lookup: {
                    from: 'MainCategory',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'categoryDetails'
                }
            },
            {
                $lookup: {
                    from: 'SubCategory',
                    localField: 'subCategory',
                    foreignField: '_id',
                    as: 'subCategoryDetails'
                }
            },
            { $unwind: { path: '$categoryDetails', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$subCategoryDetails', preserveNullAndEmptyArrays: true } },
          
            {
                $project: {
                    _id: 1,
                    name: 1,
                    sku: 1,
                    ean: 1,
                    descriptions: 1,
                    images: 1,
                    variants: 1,
                    isListed: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    category: '$categoryDetails.name',
                    subCategory: '$subCategoryDetails.name'
                }
            }
        ]);

        const totalProducts = await this.model.countDocuments();
        
        return {
            products: JSON.parse(JSON.stringify(products)),
            totalPages: 0
        };
    } catch (error) {
        console.error('Error in findAllProductsInJsonWithAggregation:', error);
        throw error;
    }
  }

  async findListedAllProducts(page:number,limit:number): Promise<ProductResponse> {
    const totalProducts = await this.model.countDocuments();
     const skip = (page - 1) * limit;
    const products= await this.model.find({ isListed: true, isDelete: false }).skip(skip).limit(limit).populate('category').populate('subCategory').exec();
    return {products:products,totalPages: Math.ceil(totalProducts / limit)}
  }

  async findProductsBySpelling(page: number, limit: number, name: string): Promise<ProductResponse> {
    const totalProducts = await this.model.countDocuments({
      isListed: true,
      isDelete: false,
      name: { $regex: name, $options: 'i' } // Case-insensitive search
    });
  
    const skip = (page - 1) * limit;
  
    // Use aggregate pipeline to prioritize prefix matches first
    const products = await this.model.aggregate([
      {
        $match: {
          isListed: true,
          isDelete: false,
          name: { $regex: name, $options: 'i' } // Case-insensitive search
        }
      },
      {
        $addFields: {
          prefixMatch: { $regexMatch: { input: "$name", regex: new RegExp(`^${name}`, 'i') } } // Prioritize prefix match
        }
      },
      {
        $sort: { prefixMatch: -1, name: 1 } // Sort by prefix match (true/false) and then alphabetically by name
      },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: { 
          from: 'MainCategory', 
          localField: 'category',
          foreignField: '_id',
          as: 'category'
        }
      }
    ]).exec();
  
    return { products: products, totalPages: Math.ceil(totalProducts / limit) };
  }


  async listProductsBySubcategories(page: number, limit: number ,mainCatId:mongoose.Types.ObjectId ): Promise<any> {
    try {
      const skip = (page - 1) * limit;
  
      const groupedProducts = await ProductModel.aggregate([
        { 
          $match: { 
            category: mainCatId, 
            isListed: true 
          } 
        },
        {
          $group: {
            _id: "$subCategory",
            products: { $push: "$$ROOT" } // Push all fields for each product in this subcategory
          }
        },
        {
          $lookup: {
            from: "subcategories", // Replace with your subcategory collection name
            localField: "_id",
            foreignField: "_id",
            as: "subCategoryDetails"
          }
        },
        {
          $unwind: "$subCategoryDetails" // Unwind to make subcategory details an object, not an array
        },
        {
          $project: {
            subCategory: "$subCategoryDetails.name",
            products: { $slice: ["$products", limit] } // Limit number of products per subcategory
          }
        },
        { $skip: skip }, // Skip to the required page
        { $limit: limit } // Limit results per page
      ]);
  
      return groupedProducts;
    } catch (error) {
      console.error("Error listing products by subcategories:", error);
      throw error;
    }
  };
  


  

  async fetchByCategoryAndName(page: number, limit: number, filter: any): Promise<ProductResponse> {

    const queryFilter: any = { isListed: true };
    if (filter.prodctname) {
      queryFilter.name = { $regex: filter.prodctname, $options: 'i' };
    }
    
    if (filter.MainCategoryId) {
      queryFilter.category = filter.MainCategoryId;
    }
  
    if (filter.SubCategoryId) {
      queryFilter.subCategory = filter.SubCategoryId;
    }
  
    const skip = (page - 1) * limit;
    const totalProducts=await this.model.countDocuments(queryFilter)
    // Fetch products with the filter, or all products if no IDs are provided
    const products= await this.model.find(queryFilter).skip(skip).limit(limit).populate('category').populate('subCategory').exec();
    
    return { products: products, totalPages: Math.ceil(totalProducts / limit) };
  }
  

  async findByName(name: string): Promise<IProductSchema | null> {
   
    return await this.model.findOne({ name: name });
  }
  async findByNameAndVariant(query:{name:string,weight:string}): Promise<boolean>{
    
    const products= await super.find({ name: query.name,variants:{weight:query.weight} })
     return products.length>0 ? true : false
  }

  async findByNameAndNotCurrentId(id: mongoose.Types.ObjectId, name: string): Promise<IProductSchema | null> {
    const regex = new RegExp(`^${name}$`, 'i');
    return await super.findOne({
      _id: { $ne: id },
      name: { $regex: regex }
    });

  }

  async productFindById(id: mongoose.Types.ObjectId): Promise<IProductSchema | null> {

    return await this.model.findById(id).populate('category').populate('subCategory').exec();
  }

  async isListedProduct(id: mongoose.Types.ObjectId): Promise<IProductSchema | null> {
    return await this.model.findOne({ _id: id, isListed: true }).exec();
  }

  async updateListing(id: mongoose.Types.ObjectId, UpdateQuery: listing): Promise<any | null> {
    return await this.model.updateOne({ _id: id }, UpdateQuery);
  }

  async updateImage(id: mongoose.Types.ObjectId, index: number, photo: string): Promise<any | null> {
    return await this.model.updateOne({ _id: id }, { $set: { [`images.${index}`]: photo } });
  }

  async updateVariantQuantity(productId: mongoose.Types.ObjectId, variantId: string, quantity: number): Promise<IProductSchema | null> {
    return await this.model.findOneAndUpdate(
      { _id: productId, 'variants._id': variantId }, // Find the product and the specific variant
      { $inc: { 'variants.$.stockQuantity': quantity } }, // Increment or decrement the stock quantity
      { new: true } // Return the updated product
    ).exec();
  }
  // Update in productRepository.ts

  async updateProduct(id: mongoose.Types.ObjectId, data: Partial<ProductCreationDTO> | Variant): Promise<IProductSchema | null> {
    const product = await this.model.findById(id);
  
    if (!product) {
      throw new Error("Product not found");
    }
  
    if ('weight' in data && 'inPrice' in data && 'outPrice' in data && 'stockQuantity' in data) {
      const variantData = data as Variant;
      const variant = product.variants.find((v: Variant) => v.weight === variantData.weight);
  
      if (variant) {
        variant.inPrice = variantData.inPrice;
        variant.outPrice = variantData.outPrice;
        variant.stockQuantity = variantData.stockQuantity;
      } else {
        product.variants.push(variantData);
      }
  
      await product.save();
      return product;
    } else {
      return await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    }
  }
  



  async deleteProduct(id: mongoose.Types.ObjectId): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }
}
