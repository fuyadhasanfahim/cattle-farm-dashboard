'use client';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BadgeDollarSign, ShoppingBasket } from 'lucide-react';
import AddPurchase from '@/components/expense/AddPurchase';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExpenseDataTable from '@/components/expense/ExpenseDataTable';

export default function ExpensePage() {
    const [formDialogOpen, setFormDialogOpen] = useState(false);

    return (
        <section>
            <div className="flex items-center gap-6">
                <Dialog open={formDialogOpen}>
                    <DialogTrigger
                        asChild
                        onClick={() => setFormDialogOpen(true)}
                    >
                        <Button size={'lg'}>
                            <ShoppingBasket />
                            Add Purchase
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl">
                        <ScrollArea className="h-[75vh]">
                            <AddPurchase
                                setFormDialogOpen={setFormDialogOpen}
                            />
                        </ScrollArea>
                    </DialogContent>
                </Dialog>

                <Button size={'lg'}>
                    <BadgeDollarSign />
                    Add Sale
                </Button>
            </div>

            <div className="mt-6">
                <Tabs defaultValue="PurchaseHistory">
                    <TabsList>
                        <TabsTrigger value="PurchaseHistory">
                            Purchase History
                        </TabsTrigger>
                        <TabsTrigger value="SalesHistory">
                            Sales History
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="PurchaseHistory">
                        <ExpenseDataTable />
                    </TabsContent>
                    <TabsContent value="SalesHistory"></TabsContent>
                </Tabs>
            </div>
        </section>
    );
}
