import mongoose, { Model } from 'mongoose';
import { BaseRepository } from './baseRepository';
import ICategoryRepo from '../../interface/categoryInterface/IcategoryRepo';
import ICategory from '../../domain/entities/categorySchema';
import { categoryCreationDTo } from '../../domain/dtos/CategoryDTO'; // Correct import for category DTO
import { LargeDataFetch } from '../../types/commonTypes';

export class CategoryRepository extends BaseRepository<ICategory> implements ICategoryRepo {
  constructor(model: Model<ICategory>) {
    super(model);
  }
  

  // Correct the DTO used in addCategory
  async addCategory(data: categoryCreationDTo): Promise<ICategory> {
    return await super.create(data);
  }

  async getAllCategories(page:number,limit:number): Promise<LargeDataFetch> {
    const skip=(page-1)*limit
    const totalCategories = await this.model.countDocuments();
    const categories= await this.model.find({isDeleted:false}).skip(skip).limit(limit);
    return{
      data:categories,
      totalPages: Math.ceil(totalCategories / limit)
    }
  }
  async findbyNameSpellings(page: number, limit: number, name: string): Promise<LargeDataFetch> {
    const skip = (page - 1) * limit;

    // Use regex to count total categories that match the spelling criteria
    const totalCategories = await this.model.countDocuments({
        isDeleted: false,
        name: { $regex: `^${name}`, $options: 'i' } // Match categories starting with the given name (case-insensitive)
    });

    // Fetch categories that match the spelling criteria
    const categories = await this.model.find({
        isDeleted: false,
        name: { $regex: `^${name}`, $options: 'i' } // Match categories starting with the given name (case-insensitive)
    }).skip(skip).limit(limit);

    return {
        data: categories,
        totalPages: Math.ceil(totalCategories / limit) // Calculate total pages
    };
}

  async getListedCategories(page: number, limit: number): Promise<LargeDataFetch> {
    const skip = (page - 1) * limit;
    const totalCategories = await this.model.countDocuments({ isListed: true, isDeleted: false });
    const categories = await this.model.find({ isListed: true, isDeleted: false })
      .skip(skip)
      .limit(limit);

    return {
      data: categories,
      totalPages: Math.ceil(totalCategories / limit)
    };
  }

  async findByName(name: string): Promise<ICategory | null> {
    const regex = new RegExp(`^${name}$`, 'i'); 
    return await super.findOne({ name: regex });
  }
  async findByNameNotId(id:mongoose.Types.ObjectId,name: string): Promise<ICategory | null> {
    const regex = new RegExp(`^${name}$`, 'i'); 
    return await super.findOne({
      _id: { $ne: id },  
      name: { $regex: regex }
    });
  }

  async getCategoryById(id: mongoose.Types.ObjectId): Promise<ICategory | null> {
    return await super.findById(id);
  }

  // Correct the DTO used in updateCategory
  async updateCategory(id: mongoose.Types.ObjectId, data: Partial<categoryCreationDTo>): Promise<ICategory | null> {
    return await super.update(id, data);
  }

  // Correct the return type to boolean
  async deleteCategory(id: mongoose.Types.ObjectId): Promise<boolean> {
    const result = await super.delete(id);
    return result !== null; // Assuming `super.delete` returns null when no document is found
  }
}

