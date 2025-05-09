
import React from 'react';
import { Roadmap } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';

interface RoadmapCardProps {
  roadmap: Roadmap;
}

const RoadmapCard: React.FC<RoadmapCardProps> = ({ roadmap }) => {
  // Calculate progress
  const completedItems = roadmap.items.filter(item => item.completed).length;
  const totalItems = roadmap.items.length;
  const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  
  // Format creation date
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(roadmap.createdAt));
  
  // Calculate total estimated hours
  const totalHours = roadmap.items.reduce((total, item) => total + item.estimatedTimeInHours, 0);

  return (
    <Card className="h-full transition-all hover:shadow-md">
      <CardHeader>
        <CardTitle>{roadmap.title}</CardTitle>
        <CardDescription>Created on {formattedDate}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{roadmap.description}</p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{completedItems} of {totalItems} completed</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-muted-foreground">Estimated time: </span>
            <span className="font-medium">{totalHours} hours</span>
          </div>
          <div>
            <span className="text-muted-foreground">Items: </span>
            <span className="font-medium">{totalItems}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/roadmap/${roadmap.id}`} className="w-full">
          <Button variant="outline" className="w-full">View Roadmap</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RoadmapCard;
