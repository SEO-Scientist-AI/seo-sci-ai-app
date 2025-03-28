
import { getGSCProperties } from "@/app/actions/getGSCProperties";
import { auth } from "@/server/auth";
import { PropertyCard } from "@/components/dashboard/property-card";

export const runtime = "edge";

export default async function DashboardPage() {
  const session = await auth();
  const properties = await getGSCProperties();

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-3">Your Properties</h1>
          <p className="text-muted-foreground text-lg">
            Select a property to view its analytics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, index) => (
            <PropertyCard 
              key={index} 
              property={property} 
              userName={session?.user?.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
