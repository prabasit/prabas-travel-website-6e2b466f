import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase, Clock, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

// Define the structure of a Career object
interface Career {
  id: string;
  title: string;
  department: string;
  location: string;
  job_type: string;
  salary_range: string;
  description: string;
  requirements: string;
  benefits: string;
  application_deadline: string;
}

interface CareerJobCardProps {
  career: Career;
  onApply: (career: Career) => void;
}

const CareerJobCard = ({ career, onApply }: CareerJobCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isExpired = new Date(career.application_deadline) < new Date();

  return (
    <Card className="w-full overflow-hidden transition-all duration-300">
      <CardHeader className="p-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-bold">{career.title}</CardTitle>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mt-2">
              <div className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> {career.department}</div>
              <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {career.location}</div>
              <div className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {career.job_type}</div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Button onClick={() => onApply(career)} disabled={isExpired}>Apply Now</Button>
          </div>
        </div>
      </CardHeader>
      
      {/* Collapsible Content Section */}
      <div className={`px-6 overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[1500px] pb-6' : 'max-h-0 pb-0'}`}>
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-2">Job Description</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">{career.description}</p>
          
          <h3 className="text-lg font-semibold mt-6 mb-2">Requirements</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">{career.requirements}</p>

          <h3 className="text-lg font-semibold mt-6 mb-2">Benefits</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">{career.benefits}</p>
        </div>
      </div>

      <CardFooter className="bg-muted/50 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4" />
          <span>Deadline: {new Date(career.application_deadline).toLocaleDateString()}</span>
          {isExpired && <Badge variant="destructive">Expired</Badge>}
        </div>
        <Button variant="ghost" onClick={() => setIsExpanded(!isExpanded)} className="flex items-center gap-2">
          {isExpanded ? 'Hide Details' : 'View Details'}
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CareerJobCard;
