import React from 'react'
import ProfileCard from './ProfileCard';
import { FileText, CheckCircle, Clock, TrendingUp, Eye, Award, Plane, MessageCircle } from 'lucide-react';

const Overview = () => {
  return (
    <>
    
       
    <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen p-4 md:p-6">
      {/* Sidebar */}
      <ProfileCard />

      {/* Right Side Content */}
      <div className="flex-1 mt-6 md:mt-0 md:ml-6 flex justify-center items-start shadow-lg p-6 rounded-2xl">
         <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Applications */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">2</div>
                <div className="text-sm text-gray-500">Total Applications</div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Accepted */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">1</div>
                <div className="text-sm text-gray-500">Accepted</div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Under Review */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">1</div>
                <div className="text-sm text-gray-500">Under Review</div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Average Progress */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">88%</div>
                <div className="text-sm text-gray-500">Avg Progress</div>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent Applications */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
            </div>
            <div className="p-6 space-y-4">
              {/* Application 1 - Under Review */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">University Application</div>
                    <div className="text-sm text-gray-500">Updated 2024-02-01</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="px-2 py-1 bg-blue-100 text-blue-700 text-[12px] font-medium rounded-full mb-1">
                    UNDER REVIEW
                  </div>
                  <div className="text-sm text-gray-500">75% complete</div>
                </div>
              </div>

              {/* Application 2 - Accepted */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">University Application</div>
                    <div className="text-sm text-gray-500">Updated 2024-02-05</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="px-3 py-1 text-center bg-green-100 text-green-700 text-[12px] font-medium rounded-full mb-1">
                    ACCEPTED
                  </div>
                  <div className="text-sm text-gray-500">100% complete</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-4">
              {/* View All Applications */}
              <button className="w-full flex items-center space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">View All Applications</div>
                </div>
              </button>

              {/* Check Offer Letters */}
              <button className="w-full flex items-center space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Check Offer Letters</div>
                </div>
              </button>

              {/* Visa Applications */}
              <button className="w-full flex items-center space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Plane className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Visa Applications</div>
                </div>
              </button>

              {/* Get Support */}
              <button className="w-full flex items-center space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Get Support</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Floating Chat Button */}
        <button className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
    </div>

          
      
      </div>
    </div>
    </>
  )
}

export default Overview