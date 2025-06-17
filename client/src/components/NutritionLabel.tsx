import React from 'react';

interface NutritionLabelProps {
  servings: number;
}

export default function NutritionLabel({ servings }: NutritionLabelProps) {
  return (
    <div className='bg-white border-2 border-black p-4 font-mono'>
      <div className='text-center border-b-2 border-black pb-2 mb-2'>
        <h3 className='text-lg font-bold'>Nutrition Facts</h3>
        <p className='text-sm'>Serving Size: {servings} servings</p>
      </div>

      <div className='border-b-2 border-black pb-2 mb-2'>
        <div className='flex justify-between'>
          <span>Amount Per Serving</span>
          <span>Calories</span>
        </div>
      </div>

      <div className='space-y-1 text-sm'>
        <div className='flex justify-between'>
          <span>Total Fat</span>
          <span>0g</span>
        </div>
        <div className='flex justify-between'>
          <span>Saturated Fat</span>
          <span>0g</span>
        </div>
        <div className='flex justify-between'>
          <span>Trans Fat</span>
          <span>0g</span>
        </div>
        <div className='flex justify-between'>
          <span>Cholesterol</span>
          <span>0mg</span>
        </div>
        <div className='flex justify-between'>
          <span>Sodium</span>
          <span>0mg</span>
        </div>
        <div className='flex justify-between'>
          <span>Total Carbohydrate</span>
          <span>0g</span>
        </div>
        <div className='flex justify-between'>
          <span>Dietary Fiber</span>
          <span>0g</span>
        </div>
        <div className='flex justify-between'>
          <span>Total Sugars</span>
          <span>0g</span>
        </div>
        <div className='flex justify-between'>
          <span>Protein</span>
          <span>0g</span>
        </div>
      </div>

      <div className='mt-4 text-xs'>
        <p>* Percent Daily Values are based on a 2,000 calorie diet.</p>
        <p>
          Your daily values may be higher or lower depending on your calorie
          needs.
        </p>
      </div>
    </div>
  );
}
