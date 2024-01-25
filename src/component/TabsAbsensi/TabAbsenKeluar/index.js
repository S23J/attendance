import { ActionIcon, Box, Flex } from '@mantine/core';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import React, { useMemo } from 'react'
import { Button } from 'react-bootstrap';
import { FaPrint } from 'react-icons/fa6';
import ExportExcel from '../../ExportExcel';
import { BsPrinter } from 'react-icons/bs';

function TabAbsenKeluar ( {
    userDetail,
    absensiKeluar,
    formattedTotalEarlyDuration,
    formattedTotalOverDuration,
} )
{

    const columns2 = useMemo(
        () => [
            {
                header: 'Tanggal',
                accessorFn: ( row ) => new Date( row.checkout_time ),
                filterVariant: 'date-range',
                Cell: ( { cell } ) => cell.getValue().toLocaleDateString(),
                mantineTableHeadCellProps: {
                    align: 'center',
                },
                mantineTableBodyCellProps: {
                    align: 'center',
                },
                size: 150,
            },
            {
                header: 'Jam',
                accessorFn: ( row ) => (
                    row.checkout_time.split( 'T' )[ 1 ].split( '.' )[ 0 ]
                ),
                mantineTableHeadCellProps: {
                    align: 'center',
                },
                mantineTableBodyCellProps: {
                    align: 'center',
                },
                size: 150,
            },
            {
                header: 'Pulang Awal',
                accessorKey: 'early_duration',
                mantineTableHeadCellProps: {
                    align: 'center',
                },
                mantineTableBodyCellProps: {
                    align: 'center',
                },
                size: 150,

            },
            {
                header: 'Lembur',
                accessorKey: 'overtime_duration',
                mantineTableHeadCellProps: {
                    align: 'center',
                },
                mantineTableBodyCellProps: {
                    align: 'center',
                },
                size: 150,

            },

        ],
        [],
    );


    const handleExportRowsExcelData2 = () =>
    {
        const excelData = table2.getRowModel().rows.map( ( row ) =>
        {
            const { original } = row;
            return {
                'Absen Keluar': original.checkout_time,
                'Pulang Awal': original.early_duration,
                'Lembur': original.overtime_duration,
                'Total Keluar Cepat': formattedTotalEarlyDuration,
                'Total Lembur': formattedTotalOverDuration,
            };
        } );

        return excelData;
    };


    const table2 = useMantineReactTable( {
        columns: columns2,
        enableDensityToggle: false,
        initialState: { density: 'xs' },
        data: absensiKeluar,
        enableRowNumbers: true,
        rowNumberMode: 'static',
        enableGlobalFilter: false,
        enableColumnResizing: false,
        isMultiSortEvent: () => true,
        mantineTableProps: {
            striped: true,
        },
        renderTopToolbarCustomActions: ( { table } ) => (
            <Box
                sx={ {
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                } }
            >
            </Box>
        ),
        renderToolbarInternalActions: ( { table } ) => (
            <Flex gap="xs" align="center">
                {/* add custom button to print table  */ }
                <ActionIcon
                >
                    <BsPrinter
                        style={ { backgroundColor: 'transparent', color: '#222' } }
                        size={ 40 }
                    />
                </ActionIcon>
                <ActionIcon>
                    <ExportExcel
                        excelData={ handleExportRowsExcelData2( table.getRowModel().rows ) }
                        fileName={ `Data Absensi Masuk ${userDetail?.first_name} ${userDetail?.last_name}` }
                    />
                </ActionIcon>
            </Flex>
        ),
    } );

    return (
        <div>
            <MantineReactTable
                table={ table2 }
            />
        </div>
    )
}

export default TabAbsenKeluar
