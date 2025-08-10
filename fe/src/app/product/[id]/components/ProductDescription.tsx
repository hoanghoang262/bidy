interface ProductDescriptionProps {
  description: string;
}

export default function ProductDescription({ description }: ProductDescriptionProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <span className="text-foreground font-semibold">
        Mô tả sản phẩm:
      </span>
      <p className="text-foreground-secondary text-base leading-relaxed">
        {description}
      </p>
    </div>
  );
} 