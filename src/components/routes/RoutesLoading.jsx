import { React } from "react";

const RoutesLoading = ({}) => {
  return (
    <div className="mt-10">
      {[1, 2, 3].map((number) => (
        <div key={number} className="animate-pulse">
          <div className="border border-zinc-800 dark:border-zinc-700 flex flex-row relative h-32 my-2 rounded animdsate-pulse">
            <div className="flex-none w-36 h-100 dark:bg-zinc-700" />
            <div className="flex flex-col py-3 pl-3 pr-6 overflow-hidden w-full">
              <div className="text-emerald-400 dark:text-emerald-800 font-bold text-sm flex justify-between">
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-zinc-700 w-4/5 mb-4" />
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-zinc-700 w-1/5 mb-4 ml-1" />
              </div>
              <div className="h-2 bg-gray-200 rounded-full dark:bg-zinc-700 mb-2.5" />
              <div className="h-2 bg-gray-200 rounded-full dark:bg-zinc-700 mb-2.5" />
              <div className="h-2 bg-gray-200 rounded-full dark:bg-zinc-700 mb-2.5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoutesLoading;
