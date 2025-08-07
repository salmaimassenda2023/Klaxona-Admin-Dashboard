"use client";
import React, { useState, useEffect } from "react";
import { BoxIconLine, GroupIcon } from "@/icons";
import {createClient} from "../../../supabase/client";


export const EcommerceMetrics = () => {
  const [clientCount, setClientCount] = useState(0);
  const [driverCount, setDriverCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchProfileCounts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch clients count
        const { count: clientsCount, error: clientsError } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('user_type', 'CLIENT');

        if (clientsError) {
          throw new Error(`Error fetching clients: ${clientsError.message}`);
        }

        // Fetch drivers count
        const { count: driversCount, error: driversError } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('user_type', 'DRIVER');

        if (driversError) {
          throw new Error(`Error fetching drivers: ${driversError.message}`);
        }

        setClientCount(clientsCount || 0);
        setDriverCount(driversCount || 0);

      } catch (err) {
        console.error('Error fetching profile counts:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');

      } finally {
        setLoading(false);
      }
    };

    fetchProfileCounts();
  }, [supabase]);

  // Format numbers with commas
  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        {/* <!-- Clients Metric Item Start --> */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Clients
            </span>
              {loading ? (
                  <div className="mt-2">
                    <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-20 rounded"></div>
                  </div>
              ) : error ? (
                  <h4 className="mt-2 font-bold text-red-600 text-title-sm dark:text-red-400">
                    Error
                  </h4>
              ) : (
                  <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                    {formatNumber(clientCount)}
                  </h4>
              )}
            </div>
          </div>
        </div>
        {/* <!-- Clients Metric Item End --> */}

        {/* <!-- Drivers Metric Item Start --> */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <BoxIconLine className="text-gray-800 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Drivers
            </span>
              {loading ? (
                  <div className="mt-2">
                    <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-20 rounded"></div>
                  </div>
              ) : error ? (
                  <h4 className="mt-2 font-bold text-red-600 text-title-sm dark:text-red-400">
                    Error
                  </h4>
              ) : (
                  <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                    {formatNumber(driverCount)}
                  </h4>
              )}
            </div>
          </div>
        </div>
        {/* <!-- Drivers Metric Item End --> */}

        {/* Error message display */}
        {error && (
            <div className="col-span-full mt-4 p-3 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">
                Failed to load metrics: {error}
              </p>
            </div>
        )}
      </div>
  );
};