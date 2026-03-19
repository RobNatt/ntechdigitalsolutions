"use client";

import { Email } from "./Email";
import { Calendar } from "./Calendar";
import { CEO } from "./CEO";

interface CategorySliderProps {
  category: string;
}

export function CategorySlider({ category }: CategorySliderProps) {
  if (category === "email") {
    return <Email />;
  }
  if (category === "calendar") {
    return <Calendar />;
  }
  if (category === "ceo") {
    return <CEO />;
  }

  return null;
}
