import { React } from "react";

const TagsLoading = () => {
  return (
    <div>
      <div>Filtrér</div>
      <div className="animate-pulse mt-1">
        <div className="flex flex-wrap">
          {[1, 2, 3, 4].map((number) => (
             <div key={number} className="h-4 mr-1 bg-gray-200 rounded-full dark:bg-zinc-700 w-20 mb-4" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagsLoading;
